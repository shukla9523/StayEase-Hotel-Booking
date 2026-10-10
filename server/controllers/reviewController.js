import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

// @desc    Create a review for a completed/confirmed booking
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { hotelId, bookingId, rating, comment, title } = req.body;

    if (!hotelId || !bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Hotel, booking, rating, and comment are required.',
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated booking not found.' });
    }

    // Must be the guest who booked
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review stays that you personally booked.',
      });
    }

    // Must not be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot review a cancelled booking.',
      });
    }

    // Check if review already exists for this booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this stay.',
      });
    }

    const review = await Review.create({
      userId: req.user._id,
      hotelId,
      bookingId,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      rating: Number(rating),
      title: title || '',
      comment: comment.trim(),
      stayDate: booking.checkIn,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
export const getHotelReviews = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ hotelId, isApproved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ hotelId, isApproved: true }),
    ]);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
