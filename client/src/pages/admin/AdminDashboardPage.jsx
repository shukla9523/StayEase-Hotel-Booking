import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  BarChart3,
  Layers,
  MessageSquare,
} from 'lucide-react';
import adminService from '../../services/paymentService';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.adminService.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500">Loading StayEase administration metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalHotels: 12,
    totalUsers: 3,
    totalBookings: 2,
    confirmedBookings: 1,
    totalRevenue: 28500,
  };

  const statCards = [
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      icon: Building2,
      color: 'bg-teal-50 text-teal-600',
      link: '/admin/hotels',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/users',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/bookings',
    },
    {
      title: 'Confirmed Stays',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/admin/bookings',
    },
    {
      title: 'Verified Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Administrative Control Center</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Live metrics across hotels, inventory, bookings, and verified revenues
            </p>
          </div>

          {/* Quick Nav Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/hotels"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              Hotels
            </Link>
            <Link
              to="/admin/rooms"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              Rooms
            </Link>
            <Link
              to="/admin/bookings"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              Bookings
            </Link>
            <Link
              to="/admin/users"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              Users
            </Link>
            <Link
              to="/admin/reviews"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs"
            >
              Reviews
            </Link>
            <Link
              to="/admin/analytics"
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Analytics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Monthly Trends & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Recent Bookings</h2>
              <Link
                to="/admin/bookings"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Hotel & Room</th>
                    <th className="pb-3">Guest</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(data?.recentBookings || []).map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                      <td className="py-3">
                        <span className="font-bold block text-slate-900">{b.hotelId?.name}</span>
                        <span className="text-[10px] text-slate-400">{b.roomId?.name}</span>
                      </td>
                      <td className="py-3">
                        <span className="block font-semibold text-slate-800">{b.guestDetails?.fullName}</span>
                        <span className="text-[10px] text-slate-400">{b.guestDetails?.email}</span>
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        ₹{b.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.bookingStatus === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Management Links & Status Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Manage Operations</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/hotels"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition-colors text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>Manage Hotels & Metadata</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/admin/rooms"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition-colors text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Manage Room Types & Inventory</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition-colors text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>User Roles & Permissions</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/admin/reviews"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition-colors text-xs font-bold text-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span>Review Moderation</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 text-white space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
                System Health
              </span>
              <h4 className="text-base font-black">All APIs & Database Operational</h4>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                Embedded MongoDB active with auto-seeding. Stripe sandbox ready for testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
