import express from 'express';
import { createReview, getHotelReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/hotel/:hotelId', getHotelReviews);

export default router;
