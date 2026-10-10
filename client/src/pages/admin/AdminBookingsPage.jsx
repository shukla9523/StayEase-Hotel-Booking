import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import adminService from '../../services/paymentService';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminService.adminService.getBookings(params);
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      await adminService.adminService.updateBookingStatus(bookingId, { status: newStatus });
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Management</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Live reservations, payments status, and guest bookings across all properties
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

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchBookings();
            }}
            className="relative flex-1 w-full"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference or guest name..."
              className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Loading reservations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Property & Room</th>
                    <th className="p-4">Guest Details</th>
                    <th className="p-4">Stay Dates</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{b.hotelId?.name}</span>
                        <span className="text-[10px] text-teal-700">{b.roomId?.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{b.guestDetails?.fullName}</span>
                        <span className="text-[10px] text-slate-400">{b.guestDetails?.phone}</span>
                      </td>
                      <td className="p-4 text-slate-700">
                        <span>{new Date(b.checkIn).toLocaleDateString()}</span>
                        <span className="block text-[10px] text-slate-400">
                          {b.nights} night(s) · {b.guests?.adults} Ad
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        ₹{b.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="font-bold uppercase text-[10px] block text-slate-800">
                          {b.paymentStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">{b.paymentProvider}</span>
                      </td>
                      <td className="p-4">
                        <select
                          disabled={updatingId === b._id}
                          value={b.bookingStatus}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`font-bold text-xs rounded-xl px-2.5 py-1.5 border focus:outline-hidden cursor-pointer ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : b.bookingStatus === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : b.bookingStatus === 'completed'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
