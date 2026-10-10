import React from 'react';
import { Compass, ShieldCheck, Award, Heart, Users, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Journey & Mission</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">About StayEase</h1>
          <p className="text-sm text-slate-500 font-normal leading-relaxed">
            Reinventing hotel reservations with curated luxury, transparent pricing, and royal heritage hospitality across the Indian subcontinent.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Crafted for Discerning Travelers</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                StayEase was founded to bridge the gap between impersonal global aggregators and authentic Indian experiential hospitality. Whether you seek the centuries-old royal courtyards of Jaipur, sunlit private villas in Goa, or pine-scented Himalayan chalets in Manali, our platform pairs verified hotel inventory with seamless digital reservations.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Every listed property undergoes comprehensive verification for amenities, cleanliness standards, and guest satisfaction before being onboarded.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-72">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
                alt="Heritage Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-slate-50 space-y-2">
              <ShieldCheck className="w-8 h-8 text-teal-600 mb-2" />
              <h3 className="text-base font-bold text-slate-900">Verified Properties</h3>
              <p className="text-xs text-slate-500 font-normal">
                Guaranteed genuine photos, transparent fees, and confirmed room allotments.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 space-y-2">
              <Award className="w-8 h-8 text-teal-600 mb-2" />
              <h3 className="text-base font-bold text-slate-900">Best Price Guarantee</h3>
              <p className="text-xs text-slate-500 font-normal">
                Competitive rates directly synchronized with property management systems.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 space-y-2">
              <Heart className="w-8 h-8 text-teal-600 mb-2" />
              <h3 className="text-base font-bold text-slate-900">Hospitality First</h3>
              <p className="text-xs text-slate-500 font-normal">
                Dedicated 24/7 travel concierge team supporting your check-in and checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
