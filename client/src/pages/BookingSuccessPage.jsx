import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Compass, ArrowRight, Printer, Sparkles } from 'lucide-react';

export const BookingSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || 'SE-CONFIRMED-DEMO';

  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
      <div className="max-w-xl w-full mx-4 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Booking Verified & Confirmed
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pack your bags!
          </h1>
          <p className="text-sm text-slate-500 font-normal max-w-sm mx-auto">
            Your stay reservation has been created and confirmed in the StayEase system.
          </p>
        </div>

        {/* Reference Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Booking Reference ID
          </p>
          <p className="text-xl font-mono font-black text-slate-900 tracking-wider">
            {reference}
          </p>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          A confirmation receipt has been sent to your registered email address. You can manage or cancel your stay anytime through your account.
        </p>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/my-bookings"
            id="view-my-bookings-btn"
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>View My Bookings</span>
          </Link>

          <Link
            to="/hotels"
            className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Stays</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
