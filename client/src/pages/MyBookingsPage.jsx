import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import bookingService from '../services/bookingService';
import { reviewService } from '../services/paymentService';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation State
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Review State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    try {
      setCancelLoading(true);
      const res = await bookingService.cancelBooking(
        selectedBookingForCancel._id,
        'Guest requested cancellation via dashboard'
      );
      if (res.success) {
        setActionNotice(res.message);
        setCancelModalOpen(false);
        await fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    try {
      setReviewLoading(true);
      const res = await reviewService.submitReview({
        hotelId: selectedBookingForReview.hotelId._id,
        bookingId: selectedBookingForReview._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        setActionNotice('Thank you! Your verified review has been submitted.');
        setReviewModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" /> Completed Stay
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Manage your upcoming reservations, stay history, and cancellations
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>Refresh</span>
          </button>
        </div>

        {actionNotice && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{actionNotice}</span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-teal-700 hover:text-teal-900 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Loading your reservations...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isEligibleToCancel =
                booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending';

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 p-6 sm:p-7 hover:shadow-md transition-shadow"
                >
                  {/* Hotel Photo */}
                  <div className="md:w-64 h-48 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={
                        booking.hotelId?.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
                      }
                      alt={booking.hotelId?.name || 'Hotel'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                          Ref: {booking.bookingReference}
                        </span>
                        {getStatusBadge(booking.bookingStatus)}
                      </div>

                      <h3 className="text-xl font-black text-slate-900">
                        {booking.hotelId?.name || 'Hotel Property'}
                      </h3>
                      <p className="text-xs font-bold text-teal-700 mt-0.5">
                        {booking.roomId?.name || 'Reserved Room'}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{booking.hotelId?.city}, {booking.hotelId?.address}</span>
                      </div>

                      {/* Dates and Guest Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-slate-50 rounded-2xl text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-in</span>
                          <span className="font-bold text-slate-800">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-out</span>
                          <span className="font-bold text-slate-800">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Guests</span>
                          <span className="font-bold text-slate-800">
                            {booking.guests?.adults} Ad, {booking.guests?.children || 0} Ch
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid</span>
                          <span className="font-black text-teal-600">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Payment: <span className="font-bold uppercase text-slate-600">{booking.paymentStatus}</span> ({booking.paymentProvider})
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Write review button if stay completed or confirmed */}
                        {booking.bookingStatus !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(booking)}
                            className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span>Leave Review</span>
                          </button>
                        )}

                        {/* Cancel button if eligible */}
                        {isEligibleToCancel && (
                          <button
                            type="button"
                            onClick={() => handleCancelClick(booking)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors"
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
            <EmptyState
              icon={Calendar}
              title="No Bookings Found"
              description="You have no current or past hotel reservations. Start searching top destinations across India to book your next stay."
              actionText="Discover Hotels"
              actionLink="/hotels"
            />
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Stay Reservation?"
        message={`Are you sure you want to cancel booking ${selectedBookingForCancel?.bookingReference}? Free refunds are automatically processed if within the property's policy window.`}
        confirmText={cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
        cancelText="Keep Booking"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
        isDangerous={true}
      />

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Share Your Stay Review</h3>
            <p className="text-xs text-slate-500">
              Reviewing {selectedBookingForReview?.hotelId?.name}
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-current'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewRating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Wonderful royal courtyard experience!"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows="4"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other travelers about the room comfort, food quality, hospitality, and amenities..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
