import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does instant room booking work on StayEase?',
      a: 'When you select check-in and check-out dates, StayEase queries our live room inventory in real-time. If available, your selected room is held and immediately confirmed upon test payment or verified Stripe transaction.',
    },
    {
      q: 'What is the StayEase cancellation policy?',
      a: 'Most properties on StayEase offer free cancellation up to 24 or 48 hours prior to check-in. If you cancel an eligible stay within that timeframe via "My Bookings", your full refund is processed automatically.',
    },
    {
      q: 'Are taxes and fees included in the prices shown?',
      a: 'Yes! We pride ourselves on zero hidden fees. At checkout, we provide a complete itemized financial breakdown including room rate, GST taxes, and platform service fees.',
    },
    {
      q: 'How can I test payments in this demo application?',
      a: 'StayEase features an Interactive Demo Payment Sandbox! When you reach checkout, you can use the pre-filled demo card (4242 4242 4242 4242) to simulate an instant verified payment without spending real money.',
    },
    {
      q: 'Can I leave a review after my stay?',
      a: 'Yes! To maintain integrity, reviews can only be submitted by verified guests with confirmed or completed bookings directly from the "My Bookings" page.',
    },
    {
      q: 'How do I access administrator features?',
      a: 'You can log in using the administrator account (admin@stayease.com / Admin@123) by clicking "Fill Admin User" on the login screen to access the full admin dashboard, hotel editor, inventory management, and analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Help & FAQs</h1>
          <p className="text-sm text-slate-500 font-normal">
            Everything you need to know about booking, payments, cancellations, and stays.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-hidden"
                >
                  <span className="text-base font-extrabold text-slate-900 pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
