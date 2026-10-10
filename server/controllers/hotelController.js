import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { calculateNights, calculateBookingPrice } from '../utils/pricing.js';

// @desc    Get all hotels with comprehensive filtering, search, and sorting
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res, next) => {
  try {
    const {
      city,
      search,
      propertyType,
      minRating,
      minPrice,
      maxPrice,
      amenities,
      sortBy = 'recommended',
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = { isActive: true };

    // Destination / City search
    if (city && city.trim() !== '') {
      query.city = { $regex: new RegExp(`^${city.trim()}`, 'i') };
    }

    // Keyword full-text or name search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { city: searchRegex }, { address: searchRegex }, { description: searchRegex }];
    }

    // Property type filter
    if (propertyType && propertyType !== 'all') {
      const types = propertyType.split(',').map((t) => t.trim());
      query.propertyType = { $in: types };
    }

    // Star rating or user rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.priceStartingFrom = {};
      if (minPrice) query.priceStartingFrom.$gte = Number(minPrice);
      if (maxPrice) query.priceStartingFrom.$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { priceStartingFrom: 1, averageRating: -1 };
        break;
      case 'price_desc':
        sortOptions = { priceStartingFrom: -1, averageRating: -1 };
        break;
      case 'rating_desc':
        sortOptions = { averageRating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'recommended':
      default:
        sortOptions = { featured: -1, averageRating: -1, reviewCount: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [hotels, total] = await Promise.all([
      Hotel.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Hotel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID or slug with rooms
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let hotel = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(id).lean();
    } else {
      hotel = await Hotel.findOne({ slug: id }).lean();
    }

    if (!hotel || !hotel.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found or currently unavailable.',
      });
    }

    // Populate active rooms
    const rooms = await Room.find({ hotelId: hotel._id, isActive: true }).lean();

    // Populate recent reviews
    const reviews = await Review.find({ hotelId: hotel._id, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      hotel: {
        ...hotel,
        rooms,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for hotel given checkIn and checkOut dates
// @route   GET /api/hotels/:id/availability
// @access  Public
export const checkHotelAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, adults = 1, children = 0 } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Both checkIn and checkOut query parameters are required.',
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date selection. Check-out must be after check-in.',
      });
    }

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const rooms = await Room.find({ hotelId: id, isActive: true }).lean();
    const nights = calculateNights(startDate, endDate);

    // Compute overlapping bookings for each room
    // Overlap condition: booking.checkIn < requestedCheckOut AND booking.checkOut > requestedCheckIn
    const roomIds = rooms.map((r) => r._id);
    const overlappingBookings = await Booking.aggregate([
      {
        $match: {
          roomId: { $in: roomIds },
          bookingStatus: { $in: ['confirmed', 'pending'] },
          checkIn: { $lt: endDate },
          checkOut: { $gt: startDate },
        },
      },
      {
        $group: {
          _id: '$roomId',
          bookedCount: { $sum: '$roomsCount' },
        },
      },
    ]);

    const bookedMap = {};
    overlappingBookings.forEach((b) => {
      bookedMap[b._id.toString()] = b.bookedCount;
    });

    const evaluatedRooms = rooms.map((room) => {
      const booked = bookedMap[room._id.toString()] || 0;
      const availableUnits = Math.max(0, room.totalInventory - booked);
      const isAvailable = availableUnits > 0;

      // Price breakdown
      const pricing = calculateBookingPrice({
        pricePerNight: room.pricePerNight,
        discountPercentage: room.discountPercentage,
        nights,
      });

      const fitsGuests = room.capacity.adults >= Number(adults);

      return {
        ...room,
        availableUnits,
        isAvailable: isAvailable && fitsGuests,
        pricing,
      };
    });

    return res.status(200).json({
      success: true,
      nights,
      rooms: evaluatedRooms,
    });
  } catch (error) {
    next(error);
  }
};
