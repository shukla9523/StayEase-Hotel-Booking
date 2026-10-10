import React from 'react';
import { Star, Quote, CheckCircle, Info } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Vikram & Ananya Singhal',
      location: 'Mumbai',
      hotel: 'The Raj Palace Heritage Haveli, Jaipur',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      comment:
        'Our stay in Jaipur felt straight out of a royal fairytale. The heritage haveli had incredible attention to detail, and the instant room reservation on StayEase made our anniversary seamless!',
    },
    {
      name: 'Rohit Malhotra',
      location: 'Bengaluru',
      hotel: 'Taj Coastal Breeze Beach Resort, Goa',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      comment:
        'The oceanfront cabana villa in Goa was immaculate. Having transparent pricing with taxes and fees upfront saved us from surprise checkout bills. Highly recommend StayEase!',
    },
    {
      name: 'Neha Sen',
      location: 'Kolkata',
      hotel: 'Himalayan Pine Retreat, Manali',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      comment:
        'Snow peaks right outside our wood-paneled balcony. The free cancellation policy gave us complete peace of mind when our mountain flight got delayed by a day.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Sample Verified Guest Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Loved by Travelers Across the Globe
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mt-2 md:mt-0 font-normal">
            Real guest satisfaction scores from verified stays booked through StayEase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-7 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-200" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-white shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <CheckCircle className="w-3 h-3 text-teal-600" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{t.location}</p>
                  <p className="text-[10px] text-teal-700 font-semibold line-clamp-1 mt-0.5">
                    Stayed at: {t.hotel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
