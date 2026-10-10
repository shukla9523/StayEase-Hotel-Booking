import express from 'express';
import {
  createCheckoutSession,
  confirmDemoPayment,
  handleStripeWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/demo-confirm', protect, confirmDemoPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
