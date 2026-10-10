import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const DemoPaymentModal = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState(booking?.guestDetails?.fullName || 'Aarav Sharma');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !booking) return null;

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate real-time secure gateway hand-shake
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await onPaymentSuccess('4242');
    } catch (err) {
      setError(err.message || 'Payment simulation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
        {/* Sandbox Indicator Banner */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Interactive Payment Gateway
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Verified Sandbox Environment
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
            <Sparkles className="w-3 h-3 text-amber-600" />
            DEMO MODE
          </span>
        </div>

        {/* Amount Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Booking Reference</p>
            <p className="text-sm font-black text-slate-900">{booking.bookingReference}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500">Total Payable</p>
            <p className="text-xl font-black text-teal-600">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Demo Simulated Credit Card Form */}
        <form onSubmit={handleSimulatePayment} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
              Card Number (Pre-filled Test Card)
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 bg-slate-50 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                CVC / CVV
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL simulated encryption. No real money will be charged.</span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Demo Payment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoPaymentModal;
