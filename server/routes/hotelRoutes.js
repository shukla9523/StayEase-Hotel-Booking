import express from 'express';
import {
  getHotels,
  getHotelById,
  checkHotelAvailability,
} from '../controllers/hotelController.js';
import { getHotelReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.get('/:id/availability', checkHotelAvailability);
router.get('/:id/reviews', getHotelReviews);

export default router;
