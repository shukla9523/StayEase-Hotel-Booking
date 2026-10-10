import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Effective Date: October 2026 · StayEase Technologies Inc.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            StayEase collects information you provide directly to us when creating an account, completing a hotel reservation, or contacting our concierge. This includes your name, email address, phone number, and stay dates.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. How We Protect Your Data</h2>
          <p>
            We implement strict security measures including bcrypt hashing for passwords, secure HTTP-only cookies for session authentication, and SSL encryption. We never store credit card numbers directly on our servers.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. Information Sharing</h2>
          <p>
            Your reservation details (name, phone, stay dates, guest count) are shared exclusively with the reserved hotel property to facilitate your check-in experience. We do not sell personal data to third-party advertisers.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Contact Privacy Officer</h2>
          <p>
            If you have any questions or data removal requests regarding this policy, please reach out to privacy@stayease.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
