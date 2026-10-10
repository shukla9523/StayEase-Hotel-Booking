import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const PopularDestinations = () => {
  const destinations = [
    {
      city: 'Jaipur',
      title: 'The Pink City',
      tagline: 'Palaces, Havelis & Forts',
      hotelCount: '15+ Properties',
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    },
    {
      city: 'Goa',
      title: 'Tropical North & South Goa',
      tagline: 'Golden Beaches & Sunset Shacks',
      hotelCount: '24+ Properties',
      image:
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
    },
    {
      city: 'Delhi',
      title: 'New Delhi & NCR',
      tagline: 'Colonial Glamour & Modern Luxury',
      hotelCount: '18+ Properties',
      image:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
    },
    {
      city: 'Mumbai',
      title: 'City of Dreams',
      tagline: 'Arabian Sea Vistas & Marine Drive',
      hotelCount: '20+ Properties',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    },
    {
      city: 'Udaipur',
      title: 'City of Lakes',
      tagline: 'Lake Pichola Marble Palaces',
      hotelCount: '12+ Properties',
      image:
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
    },
    {
      city: 'Manali',
      title: 'Himalayan Valleys',
      tagline: 'Snow-capped Peaks & Pine Chalets',
      hotelCount: '10+ Properties',
      image:
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-teal-600 block mb-2">
              Trending Escapes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Destinations Across India
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md mt-2 md:mt-0 font-normal">
            Handpicked destinations celebrating India’s architectural wonders, tropical coastlines, and alpine sanctuaries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              to={`/hotels?city=${dest.city}`}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-80 flex flex-col justify-end p-6 border border-slate-200/50"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-950/70 border border-teal-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    <MapPin className="w-3 h-3" />
                    {dest.hotelCount}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white">{dest.city}</h3>
                <p className="text-xs text-slate-300 font-medium">{dest.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
