import React from 'react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms and Conditions</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Effective Date: October 2026 · StayEase Technologies Inc.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using StayEase, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you must discontinue using our services immediately.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. Booking and Reservations</h2>
          <p>
            All bookings are subject to room availability at the time of reservation. When you book through StayEase, you agree to provide accurate guest names and contact details matching government-issued identification required at check-in.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. Cancellation and Refund Policy</h2>
          <p>
            Cancellations are governed by the specific room policy indicated at the time of booking. For eligible bookings cancelled within the free cancellation window, refunds are credited back to the original payment method.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. User Conduct and Reviews</h2>
          <p>
            Reviews must reflect genuine personal stay experiences. StayEase reserves the right to moderate or remove reviews containing inappropriate language or fraudulent claims.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
