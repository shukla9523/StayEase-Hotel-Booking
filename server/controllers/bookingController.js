import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import { calculateNights, calculateBookingPrice, generateBookingReference } from '../utils/pricing.js';

// Helper to check room availability during requested window
export const checkRoomAvailability = async (roomId, startDate, endDate, requestedCount = 1) => {
  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    return { available: false, reason: 'Room not found or inactive', room: null };
  }

  // Count overlapping active bookings
  const overlapping = await Booking.aggregate([
    {
      $match: {
        roomId: room._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
        checkIn: { $lt: endDate },
        checkOut: { $gt: startDate },
      },
    },
    {
      $group: {
        _id: '$roomId',
        totalBooked: { $sum: '$roomsCount' },
      },
    },
  ]);

  const currentlyBooked = overlapping.length > 0 ? overlapping[0].totalBooked : 0;
  const remainingInventory = room.totalInventory - currentlyBooked;

  if (remainingInventory < requestedCount) {
    return {
      available: false,
      reason: `Only ${Math.max(0, remainingInventory)} room(s) available for selected dates.`,
      remainingInventory,
      room,
    };
  }

  return { available: true, remainingInventory, room };
};

// @desc    Create a new booking (Strict server-side validation & pricing)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests = { adults: 2, children: 0 },
      guestDetails,
      roomsCount = 1,
      paymentProvider = 'demo_gateway',
      instantDemoConfirm = false,
    } = req.body;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past.' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
    }

    if (!guestDetails || !guestDetails.fullName || !guestDetails.email || !guestDetails.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full guest details (full name, email, and phone number).',
      });
    }

    // Verify hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ success: false, message: 'Selected hotel is unavailable.' });
    }

    // Atomic availability verification
    const countToBook = Math.max(1, Number(roomsCount));
    const availability = await checkRoomAvailability(roomId, startDate, endDate, countToBook);

    if (!availability.available) {
      return res.status(409).json({
        success: false,
        message: availability.reason || 'Room is unavailable for the selected dates.',
      });
    }

    const room = availability.room;

    // Check capacity
    if (Number(guests.adults) > room.capacity.adults * countToBook) {
      return res.status(400).json({
        success: false,
        message: `Maximum guest capacity for ${countToBook} room(s) is ${room.capacity.adults * countToBook} adults.`,
      });
    }

    // Server-side calculated nights & pricing
    const nights = calculateNights(startDate, endDate);
    const pricing = calculateBookingPrice({
      pricePerNight: room.pricePerNight,
      discountPercentage: room.discountPercentage,
      nights,
      roomsCount: countToBook,
    });

    const bookingReference = generateBookingReference();

    // Determine initial status based on payment verification flow
    const isInstantDemo = Boolean(instantDemoConfirm);

    const booking = await Booking.create({
      bookingReference,
      userId: req.user._id,
      hotelId: hotel._id,
      roomId: room._id,
      checkIn: startDate,
      checkOut: endDate,
      guests: {
        adults: Number(guests.adults),
        children: Number(guests.children || 0),
      },
      guestDetails: {
        fullName: guestDetails.fullName.trim(),
        email: guestDetails.email.trim(),
        phone: guestDetails.phone.trim(),
        specialRequests: guestDetails.specialRequests ? guestDetails.specialRequests.trim() : '',
      },
      roomsCount: countToBook,
      nights,
      pricePerNight: pricing.pricePerNight,
      subtotal: pricing.subtotal,
      taxes: pricing.taxes,
      fees: pricing.fees,
      discount: pricing.discount,
      totalAmount: pricing.totalAmount,
      currency: 'INR',
      bookingStatus: isInstantDemo ? 'confirmed' : 'pending',
      paymentStatus: isInstantDemo ? 'paid' : 'unpaid',
      paymentProvider: paymentProvider,
      paymentReference: isInstantDemo ? `DEMO-PAY-${Date.now().toString(36).toUpperCase()}` : '',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotelId', 'name city address images starRating')
      .populate('roomId', 'name roomType bedType mealPlan cancellationPolicy');

    return res.status(201).json({
      success: true,
      message: isInstantDemo ? 'Booking confirmed successfully!' : 'Booking created. Awaiting payment.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name city address images starRating slug')
      .populate('roomId', 'name roomType bedType mealPlan cancellationPolicy images')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('hotelId', 'name city address images starRating phone email coordinates')
      .populate('roomId', 'name roomType bedType mealPlan cancellationPolicy amenities images')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ownership or admin check
    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this booking.',
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking according to policy
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by guest' } = req.body;

    const booking = await Booking.findById(id).populate('roomId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ownership or admin check
    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot cancel another user\'s booking.',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed bookings cannot be cancelled.',
      });
    }

    // Calculate refund based on room cancellation policy
    const now = new Date();
    const checkInTime = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInTime - now) / (1000 * 60 * 60);

    const roomPolicy = booking.roomId?.cancellationPolicy;
    const cancelWindow = roomPolicy?.cancelBeforeHours || 24;
    const isFree = roomPolicy?.isFreeCancellation ?? true;

    let refundAmount = 0;
    if (booking.paymentStatus === 'paid') {
      if (isFree && hoursUntilCheckIn >= cancelWindow) {
        refundAmount = booking.totalAmount; // Full refund
      } else if (hoursUntilCheckIn > 0) {
        refundAmount = Math.round(booking.totalAmount * 0.7); // 70% partial refund
      } else {
        refundAmount = 0; // Past check-in time
      }
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = refundAmount > 0 ? 'refunded' : 'paid';
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. ${
        refundAmount > 0 ? `₹${refundAmount.toLocaleString()} has been processed for refund.` : 'No refund issued as per policy.'
      }`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};
