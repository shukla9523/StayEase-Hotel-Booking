import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Waves, Mountain, Building, Trees } from 'lucide-react';

export const CategoriesSection = () => {
  const categories = [
    {
      name: 'Heritage Haveli',
      title: 'Royal Heritage Havelis',
      desc: 'Restored 18th-century courtyards & Rajputana architecture',
      icon: Crown,
      filter: 'Heritage Haveli',
      color: 'from-amber-500/10 to-amber-600/20 text-amber-600',
    },
    {
      name: 'Resort',
      title: 'Beach & Nature Resorts',
      desc: 'Cascading infinity pools, private beaches & backwaters',
      icon: Waves,
      filter: 'Resort',
      color: 'from-teal-500/10 to-teal-600/20 text-teal-600',
    },
    {
      name: 'Palace',
      title: 'Grand Regal Palaces',
      desc: 'Lake Pichola marble palaces & Maharaja suites',
      icon: Crown,
      filter: 'Palace',
      color: 'from-purple-500/10 to-purple-600/20 text-purple-600',
    },
    {
      name: 'Boutique',
      title: 'Boutique Urban Stays',
      desc: 'Smart high-tech amenities, artisanal dining & rooftop lounges',
      icon: Building,
      filter: 'Boutique',
      color: 'from-blue-500/10 to-blue-600/20 text-blue-600',
    },
    {
      name: 'Villa',
      title: 'Private Luxury Villas',
      desc: 'Exclusive plunge pools, private chefs & seclusion',
      icon: Trees,
      filter: 'Villa',
      color: 'from-emerald-500/10 to-emerald-600/20 text-emerald-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-teal-600 block mb-2">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Stay by Collection
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Choose an experience crafted around your travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/hotels?propertyType=${cat.filter}`}
                className="group p-6 rounded-3xl border border-slate-100 hover:border-teal-200 hover:shadow-xl bg-white hover:bg-slate-50/50 transition-all duration-300 flex flex-col items-center text-center space-y-4"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
