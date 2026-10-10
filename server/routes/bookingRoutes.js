import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { validateBookingDates } from '../middleware/validate.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', validateBookingDates, createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
