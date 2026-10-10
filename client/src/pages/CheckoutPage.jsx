import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  Lock,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import hotelService from '../services/hotelService';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import DemoPaymentModal from '../components/checkout/DemoPaymentModal';

export const CheckoutPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { nights } = useSearch();

  // URL state
  const hotelId = searchParams.get('hotelId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = Number(searchParams.get('adults')) || 2;
  const childrenCount = Number(searchParams.get('children')) || 0;

  // Data state
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [guestDetails, setGuestDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });

  // Demo payment modal state
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestDetails((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Fetch hotel and target room
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        if (!hotelId) throw new Error('Missing hotel reference');

        const res = await hotelService.getHotelById(hotelId);
        if (res.success && res.hotel) {
          setHotel(res.hotel);
          const foundRoom = res.hotel.rooms?.find((r) => r._id === roomId);
          if (foundRoom) {
            setRoom(foundRoom);
          } else {
            throw new Error('Room not found for this hotel.');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load checkout details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [hotelId, roomId]);

  // Price calculations
  const calculatePricing = () => {
    if (!room) return { subtotal: 0, taxes: 0, fees: 299, total: 0 };
    const price = room.pricePerNight;
    const discountPct = room.discountPercentage || 0;
    const gross = price * Math.max(1, nights);
    const discount = discountPct > 0 ? Math.round((gross * discountPct) / 100) : 0;
    const subtotal = gross - discount;
    const taxes = Math.round(subtotal * 0.12); // 12% GST
    const fees = 299; // Standard service fee
    const total = subtotal + taxes + fees;
    return { gross, discount, subtotal, taxes, fees, total };
  };

  const pricing = calculatePricing();

  const handleBookingSubmit = async (e, paymentMethod = 'demo_gateway') => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${roomId}?${searchParams.toString()}` } });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create booking on server (Strict server-side validation & pricing)
      const bookingPayload = {
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests: { adults, children: childrenCount },
        guestDetails,
        paymentProvider: paymentMethod,
        instantDemoConfirm: false,
      };

      const res = await bookingService.createBooking(bookingPayload);
      if (!res.success || !res.booking) {
        throw new Error(res.message || 'Booking creation failed.');
      }

      const booking = res.booking;
      setCreatedBooking(booking);

      // 2. Handle Payment Flow
      if (paymentMethod === 'stripe') {
        const stripeRes = await paymentService.createCheckoutSession(booking._id);
        if (stripeRes.isDemo || !stripeRes.url) {
          // Fallback to Demo Gateway
          setIsDemoModalOpen(true);
        } else {
          // Redirect to real Stripe Checkout URL
          window.location.href = stripeRes.url;
        }
      } else {
        // Open Interactive Demo Gateway Modal
        setIsDemoModalOpen(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate booking. Room may be unavailable for chosen dates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (demoCardLast4) => {
    if (!createdBooking) return;
    const res = await paymentService.confirmDemoPayment(createdBooking._id, demoCardLast4);
    if (res.success) {
      navigate(`/booking/success?reference=${createdBooking.bookingReference}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Verifying room rates and inventory...</p>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Checkout Error</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <Link
            to="/hotels"
            className="px-6 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Return to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review & Complete Booking</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Rechecked real-time inventory · Encrypted checkout
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-amber-900">Sign in to complete your reservation</p>
              <p className="text-xs text-amber-700">
                You must be logged into StayEase to book rooms and access your bookings dashboard.
              </p>
            </div>
            <Link
              to="/login"
              state={{ from: `/checkout/${roomId}?${searchParams.toString()}` }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs text-center"
            >
              Sign In or Register
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guest Details Form & Payment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Users className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-black text-slate-900">Guest Contact Details</h2>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form id="checkout-guest-form" className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Primary Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestDetails.fullName}
                    onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                    placeholder="Enter full name (as on ID)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={guestDetails.specialRequests}
                    onChange={(e) =>
                      setGuestDetails({ ...guestDetails, specialRequests: e.target.value })
                    }
                    placeholder="Early check-in, quiet room, dietary requests..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method Selector & Trigger */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-black text-slate-900">Select Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Demo Payment Option */}
                <div className="p-4 rounded-2xl border-2 border-teal-500 bg-teal-50/30 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Interactive Demo Payment Gateway
                      </span>
                      <span className="text-[10px] font-black uppercase bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Zero friction sandbox test. Instant server-side payment verification without needing live Stripe credentials.
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-teal-600 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  </div>
                </div>

                {/* Stripe Test Mode Option */}
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Stripe Test-Mode Checkout
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Card Test
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Uses configured Stripe test keys or automatically transitions to Demo Gateway if unset.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Verified</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    id="confirm-booking-demo-btn"
                    onClick={(e) => handleBookingSubmit(e, 'demo_gateway')}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Room...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Reservation</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Summary Card */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900">Stay Summary</h3>

              {/* Hotel & Room Preview */}
              <div className="flex gap-4 pb-6 border-b border-slate-100">
                <img
                  src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                  alt={hotel.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-1">
                    {hotel.name}
                  </h4>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{room.name}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    <span>{hotel.city}, {hotel.state}</span>
                  </p>
                </div>
              </div>

              {/* Date & Guests breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 pb-6 border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Dates</span>
                  <span className="font-bold text-slate-800">
                    {new Date(checkIn).toLocaleDateString()} – {new Date(checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Duration</span>
                  <span className="font-bold text-slate-800">{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Guests</span>
                  <span className="font-bold text-slate-800">{adults} Adults · {childrenCount} Children</span>
                </div>
              </div>

              {/* Itemized Financial Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">
                    Base Rate ({nights} night{nights > 1 ? 's' : ''} × ₹{room.pricePerNight.toLocaleString('en-IN')})
                  </span>
                  <span className="font-bold text-slate-800">
                    ₹{pricing.gross.toLocaleString('en-IN')}
                  </span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount ({room.discountPercentage}% OFF)</span>
                    <span>-₹{pricing.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Goods & Services Tax (12% GST)</span>
                  <span className="font-bold text-slate-800">
                    ₹{pricing.taxes.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">StayEase Platform Fee</span>
                  <span className="font-bold text-slate-800">
                    ₹{pricing.fees.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between text-slate-900">
                  <span className="text-sm font-black">Final Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-teal-600">
                      ₹{pricing.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">All taxes & fees included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        booking={createdBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CheckoutPage;
