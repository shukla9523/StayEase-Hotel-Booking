import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const SpecialOffers = () => {
  const offers = [
    {
      title: 'Royal Rajputana Heritage Special',
      badge: 'Limited Time Promo',
      description: 'Enjoy 15% savings + complimentary royal courtyard breakfast on all heritage havelis in Jaipur & Udaipur.',
      code: 'ROYAL15',
      destination: 'Jaipur',
      discount: '15% OFF',
      validity: 'Valid for stays booked this month',
      bgGradient: 'from-amber-600 to-amber-800',
    },
    {
      title: 'Goa Coastal Breeze Escapes',
      badge: 'Beachfront Perk',
      description: 'Book 3+ nights at North or South Goa beachfront resorts and unlock 20% off plus free airport transfers.',
      code: 'GOA20',
      destination: 'Goa',
      discount: '20% OFF',
      validity: 'Instant confirmation sandbox offer',
      bgGradient: 'from-teal-600 to-cyan-800',
    },
    {
      title: 'Himalayan Serenity Retreat',
      badge: 'Alpine Wellness',
      description: 'Escape to snow peaks and deodar pine chalets in Manali & Shimla with complimentary evening tea & spa credits.',
      code: 'HIMALAYA10',
      destination: 'Manali',
      discount: '₹1,500 OFF',
      validity: 'Applicable on mountain view suites',
      bgGradient: 'from-indigo-600 to-slate-900',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Interactive Demo Promotions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Exclusive Member Offers
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mt-2 md:mt-0 font-normal">
            Special seasonal offers ready to test in our interactive booking demo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className={`rounded-3xl p-7 bg-gradient-to-br ${offer.bgGradient} text-white shadow-lg flex flex-col justify-between relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {offer.badge}
                  </span>
                  <span className="text-xl font-black tracking-tight text-amber-300">
                    {offer.discount}
                  </span>
                </div>

                <h3 className="text-xl font-black leading-snug">{offer.title}</h3>
                <p className="text-xs text-white/80 leading-relaxed font-normal">
                  {offer.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-white/15 space-y-4 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Code:</span>
                    <span className="font-mono font-black bg-black/25 px-2 py-0.5 rounded-md tracking-wider">
                      {offer.code}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/hotels?city=${offer.destination}`}
                  className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Explore {offer.destination} Stays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
