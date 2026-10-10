import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MapPin, Building, CreditCard, Loader2 } from 'lucide-react';
import adminService from '../../services/paymentService';

export const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminService.adminService.getAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500">Aggregating platform analytics...</p>
      </div>
    );
  }

  const cityBreakdown = data?.cityBreakdown || [];
  const statusBreakdown = data?.statusBreakdown || [];
  const propertyTypes = data?.propertyTypeBreakdown || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Geographic distribution, booking conversion, and property category metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destination Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-black text-slate-900">Hotels by Destination</h2>
            </div>

            <div className="space-y-3">
              {cityBreakdown.map((item) => (
                <div key={item._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{item._id}</span>
                    <span className="text-teal-600">{item.hotelCount} properties (Avg ⭐ {item.avgRating?.toFixed(1)})</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.hotelCount / 6) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Statuses & Financials */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-black text-slate-900">Bookings by Status</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {statusBreakdown.map((item) => (
                <div key={item._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {item._id}
                  </span>
                  <div className="text-xl font-black text-slate-900">{item.count} Bookings</div>
                  <p className="text-xs font-bold text-teal-700">
                    ₹{(item.totalRevenue || 0).toLocaleString('en-IN')} volume
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Property Category Distribution */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-black text-slate-900">Property Categories Available</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {propertyTypes.map((pt) => (
                <div key={pt._id} className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 text-center space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">{pt._id}</span>
                  <span className="text-2xl font-black text-teal-700 block">{pt.count}</span>
                  <span className="text-[10px] text-slate-400">active listings</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
