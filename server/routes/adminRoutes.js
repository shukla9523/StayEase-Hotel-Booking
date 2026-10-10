import express from 'express';
import {
  getDashboardStats,
  getAdminHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  getAdminBookings,
  updateBookingStatus,
  getAdminUsers,
  updateUserRole,
  getAdminReviews,
  deleteReview,
  getAdminAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Strict authorization: all endpoints require admin role
router.use(protect, authorize('admin'));

// Dashboard and Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAdminAnalytics);

// Hotels
router.get('/hotels', getAdminHotels);
router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

// Rooms
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// Bookings
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Users
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);

// Reviews
router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
