import Stripe from 'stripe';
import config from '../config/config.js';
import Booking from '../models/Booking.js';

let stripe = null;
if (config.stripeSecretKey) {
  stripe = new Stripe(config.stripeSecretKey);
}

// @desc    Create Stripe Checkout Session or initialize payment
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('hotelId').populate('roomId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure only booking owner can pay
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to booking.' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid.' });
    }

    // Check if Stripe is configured
    if (!stripe || !config.stripeSecretKey) {
      // Demo Payment Flow - clearly indicated for development/testing
      return res.status(200).json({
        success: true,
        isDemo: true,
        message: 'Stripe keys not configured in environment. Using StayEase Interactive Demo Payment gateway.',
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
      });
    }

    // Real Stripe test checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: booking.guestDetails.email,
      client_reference_id: booking._id.toString(),
      line_items: [
        {
          price_data: {
            currency: booking.currency.toLowerCase(),
            product_data: {
              name: `${booking.hotelId.name} - ${booking.roomId.name}`,
              description: `${booking.nights} night(s) stay from ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.totalAmount * 100), // Stripe uses minor currency units (paise/cents)
          },
          quantity: 1,
        },
      ],
      success_url: `${config.clientUrl}/booking/success?reference=${booking.bookingReference}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/checkout/${booking.roomId._id}?cancelled=true`,
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      isDemo: false,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment via Interactive Demo Gateway
// @route   POST /api/payments/demo-confirm
// @access  Private
export const confirmDemoPayment = async (req, res, next) => {
  try {
    const { bookingId, demoCardLast4 = '4242' } = req.body;

    const booking = await Booking.findById(bookingId).populate('hotelId').populate('roomId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to booking.' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Booking is already paid and confirmed.',
        booking,
      });
    }

    // Server-side verification and idempotent confirmation
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    booking.paymentProvider = 'demo_gateway';
    booking.paymentReference = `DEMO-CARD-${demoCardLast4}-${Date.now().toString(36).toUpperCase()}`;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Demo payment simulated and verified successfully. Booking confirmed!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Signature verified)
export const handleStripeWebhook = async (req, res) => {
  if (!stripe || !config.stripeWebhookSecret) {
    return res.status(200).json({ received: true, message: 'Webhook bypassed (no Stripe secret configured)' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);
  } catch (err) {
    console.error(`[Stripe Webhook] Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.client_reference_id;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking && booking.paymentStatus !== 'paid') {
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        booking.paymentProvider = 'stripe';
        booking.paymentReference = session.payment_intent || session.id;
        await booking.save();
        console.log(`[Stripe Webhook] Booking ${booking.bookingReference} confirmed.`);
      }
    }
  }

  return res.status(200).json({ received: true });
};
