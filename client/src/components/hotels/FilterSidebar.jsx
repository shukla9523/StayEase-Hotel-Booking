import React from 'react';
import { RotateCcw, Filter, Star, Check } from 'lucide-react';

export const FilterSidebar = ({
  filters,
  setFilters,
  onReset,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const propertyTypes = ['Hotel', 'Resort', 'Villa', 'Heritage Haveli', 'Boutique', 'Palace'];
  const popularAmenities = [
    'Free Wi-Fi',
    'Swimming Pool',
    'Spa & Wellness',
    'Fine Dining',
    'Free Breakfast',
    'Airport Shuttle',
    'Sea View',
  ];

  const handlePropertyTypeToggle = (type) => {
    const current = filters.propertyType || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFilters({ ...filters, propertyType: updated });
  };

  const handleAmenityToggle = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFilters({ ...filters, amenities: updated });
  };

  return (
    <aside
      className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 ${
        isMobileDrawer ? 'h-full overflow-y-auto' : ''
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-teal-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
          Price per Night (₹)
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="1000"
            max="25000"
            step="500"
            value={filters.maxPrice || 25000}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>₹1,000</span>
            <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
              Up to ₹{(filters.maxPrice || 25000).toLocaleString('en-IN')}
            </span>
            <span>₹25,000+</span>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
          Star Rating
        </label>
        <div className="space-y-2">
          {[5, 4, 3].map((star) => (
            <label
              key={star}
              className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900 select-none"
            >
              <input
                type="checkbox"
                checked={(filters.starRating || []).includes(star)}
                onChange={() => {
                  const current = filters.starRating || [];
                  const updated = current.includes(star)
                    ? current.filter((s) => s !== star)
                    : [...current, star];
                  setFilters({ ...filters, starRating: updated });
                }}
                className="w-4 h-4 rounded-md text-teal-600 border-slate-300 focus:ring-teal-500 accent-teal-600"
              />
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-slate-500">{star} Stars</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guest Rating Score */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
          Guest Rating
        </label>
        <div className="space-y-2">
          {[
            { label: '4.8+ Exceptional', score: 4.8 },
            { label: '4.5+ Superb', score: 4.5 },
            { label: '4.0+ Very Good', score: 4.0 },
          ].map((item) => (
            <label
              key={item.score}
              className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900 select-none"
            >
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === item.score}
                onChange={() =>
                  setFilters({
                    ...filters,
                    minRating: filters.minRating === item.score ? null : item.score,
                  })
                }
                className="w-4 h-4 text-teal-600 accent-teal-600"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
          Property Type
        </label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900 select-none"
            >
              <input
                type="checkbox"
                checked={(filters.propertyType || []).includes(type)}
                onChange={() => handlePropertyTypeToggle(type)}
                className="w-4 h-4 rounded-md text-teal-600 border-slate-300 accent-teal-600"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popular Amenities */}
      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
          Popular Amenities
        </label>
        <div className="space-y-2">
          {popularAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900 select-none"
            >
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 rounded-md text-teal-600 border-slate-300 accent-teal-600"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {isMobileDrawer && (
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-3 bg-teal-600 text-white font-bold text-sm rounded-xl"
          >
            Show Results
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
