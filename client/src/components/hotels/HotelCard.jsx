import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';
import RatingBadge from './RatingBadge';
import AmenityIcon from './AmenityIcon';
import { useSearch } from '../../context/SearchContext';

export const HotelCard = ({ hotel }) => {
  const { nights } = useSearch();

  const fallbackImage =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
  const imageUrl =
    hotel.images && hotel.images.length > 0 ? hotel.images[0].url : fallbackImage;

  const startingPrice = hotel.priceStartingFrom || 4500;
  const estimatedTotal = startingPrice * Math.max(1, nights);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {hotel.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {hotel.propertyType || 'Hotel'}
          </span>
        </div>

        {/* Star Rating on Image */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1 text-amber-400">
          {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
          <span className="text-white text-xs font-bold ml-1">{hotel.starRating}-Star</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
              <Link to={`/hotels/${hotel._id || hotel.slug}`}>{hotel.name}</Link>
            </h3>
            <RatingBadge rating={hotel.averageRating || 4.8} size="sm" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{hotel.city}, {hotel.state || 'India'}</span>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5">
            {(hotel.amenities || []).slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600"
              >
                <AmenityIcon name={amenity} className="w-3 h-3 text-teal-600" />
                <span>{amenity}</span>
              </span>
            ))}
            {(hotel.amenities || []).length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-slate-50 text-[11px] font-semibold text-slate-400">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="border-t border-slate-100 pt-4 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-950">
                ₹{startingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
            {nights > 1 && (
              <span className="text-[11px] font-bold text-teal-700 block">
                ₹{estimatedTotal.toLocaleString('en-IN')} total for {nights} nights
              </span>
            )}
          </div>

          <Link
            to={`/hotels/${hotel._id || hotel.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs shadow-teal-600/20 group-hover:translate-x-0.5 transition-all"
          >
            <span>View Stay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
