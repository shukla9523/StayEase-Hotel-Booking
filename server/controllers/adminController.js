import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Admin dashboard metrics and overview
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalHotels, totalUsers, totalBookings, confirmedBookings, revenueAgg, recentBookings] =
      await Promise.all([
        Hotel.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ bookingStatus: 'confirmed' }),
        Booking.aggregate([
          { $match: { paymentStatus: 'paid', bookingStatus: { $ne: 'cancelled' } } },
          { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]),
        Booking.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .populate('hotelId', 'name city')
          .populate('roomId', 'name roomType')
          .populate('userId', 'name email')
          .lean(),
      ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Monthly revenue and booking trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          bookingsCount: { $sum: 1 },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] },
          },
          revenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$paymentStatus', 'paid'] },
                    { $ne: ['$bookingStatus', 'cancelled'] },
                  ],
                },
                '$totalAmount',
                0,
              ],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyTrends.map((t) => ({
      name: `${monthNames[t._id.month - 1]} ${t._id.year}`,
      bookings: t.bookingsCount,
      confirmed: t.confirmedCount,
      revenue: t.revenue,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalHotels,
        totalUsers,
        totalBookings,
        confirmedBookings,
        totalRevenue,
      },
      recentBookings,
      monthlyTrends: formattedTrends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all hotels
// @route   GET /api/admin/hotels
// @access  Private (Admin)
export const getAdminHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: hotels.length, hotels });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create hotel
// @route   POST /api/admin/hotels
// @access  Private (Admin)
export const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      description,
      city,
      state,
      address,
      country = 'India',
      starRating = 4,
      propertyType = 'Hotel',
      priceStartingFrom = 0,
      amenities = [],
      images = [],
      coordinates = { latitude: 0, longitude: 0 },
      featured = false,
    } = req.body;

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    const hotel = await Hotel.create({
      name,
      slug,
      tagline,
      description,
      city,
      state,
      address,
      country,
      starRating: Number(starRating),
      propertyType,
      priceStartingFrom: Number(priceStartingFrom),
      amenities,
      images,
      coordinates,
      featured,
    });

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully.',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update hotel
// @route   PUT /api/admin/hotels/:id
// @access  Private (Admin)
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Hotel updated successfully.',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete hotel
// @route   DELETE /api/admin/hotels/:id
// @access  Private (Admin)
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    // Cascade delete rooms
    await Room.deleteMany({ hotelId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Hotel and associated rooms deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create room for a hotel
// @route   POST /api/admin/rooms
// @access  Private (Admin)
export const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    // Update hotel's priceStartingFrom if this room is cheaper
    const minRoom = await Room.findOne({ hotelId: room.hotelId, isActive: true }).sort({ pricePerNight: 1 });
    if (minRoom) {
      await Hotel.findByIdAndUpdate(room.hotelId, { priceStartingFrom: minRoom.pricePerNight });
    }

    return res.status(201).json({
      success: true,
      message: 'Room created successfully.',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update room
// @route   PUT /api/admin/rooms/:id
// @access  Private (Admin)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Room updated successfully.',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete room
// @route   DELETE /api/admin/rooms/:id
// @access  Private (Admin)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Room deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAdminBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ bookingReference: searchRegex }, { 'guestDetails.fullName': searchRegex }, { 'guestDetails.email': searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('hotelId', 'name city')
        .populate('roomId', 'name roomType')
        .populate('userId', 'name email')
        .lean(),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update booking status
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (status) booking.bookingStatus = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be user or admin.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('hotelId', 'name city')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete review (moderation)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [cityBreakdown, statusBreakdown, propertyTypeBreakdown] = await Promise.all([
      Hotel.aggregate([
        { $group: { _id: '$city', hotelCount: { $sum: 1 }, avgRating: { $avg: '$averageRating' } } },
        { $sort: { hotelCount: -1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: '$bookingStatus', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Hotel.aggregate([
        { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      cityBreakdown,
      statusBreakdown,
      propertyTypeBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
