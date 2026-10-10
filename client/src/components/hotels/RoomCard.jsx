import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bed,
  Maximize2,
  Check,
  ShieldCheck,
  AlertCircle,
  Coffee,
  Sparkles,
} from 'lucide-react';
import AmenityIcon from './AmenityIcon';
import { useSearch } from '../../context/SearchContext';

export const RoomCard = ({ room, hotelId, isAvailable = true, availableUnits = 5 }) => {
  const navigate = useNavigate();
  const { checkIn, checkOut, adults, childrenCount, nights } = useSearch();

  const fallback =
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80';
  const imageUrl =
    room.images && room.images.length > 0 ? room.images[0].url : fallback;

  const basePrice = room.pricePerNight || 5000;
  const discount = room.discountPercentage || 0;
  const discountedPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
  const totalEstimated = discountedPrice * Math.max(1, nights);

  const handleReserve = () => {
    navigate(
      `/checkout/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}&hotelId=${hotelId}`
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col lg:flex-row gap-6">
      {/* Room Image */}
      <div className="lg:w-72 h-52 lg:h-auto rounded-2xl overflow-hidden relative bg-slate-100 shrink-0">
        <img
          src={imageUrl}
          alt={room.name}
          onError={(e) => {
            e.currentTarget.src = fallback;
          }}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Room Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 className="text-xl font-black text-slate-900">{room.name}</h4>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {room.roomType || 'Deluxe'}
            </span>
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Fits {room.capacity?.adults || 2} Adults</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-teal-600" />
              <span>{room.bedType || '1 King Bed'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-teal-600" />
              <span>{room.roomSizeSqFt || 350} sq.ft</span>
            </div>
          </div>

          {/* Meal Plan & Cancellation Badges */}
          <div className="space-y-1.5 mb-4">
            {room.mealPlan && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
                <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                <span>{room.mealPlan}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{room.cancellationPolicy?.description || 'Free cancellation available'}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {(room.amenities || []).slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-medium text-slate-600"
              >
                <AmenityIcon name={amenity} className="w-3 h-3 text-teal-600" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through block">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ night</span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 block">
              ₹{totalEstimated.toLocaleString('en-IN')} total ({nights} night{nights > 1 ? 's' : ''})
              excl. taxes
            </span>

            {/* Inventory Urgency Alert */}
            {isAvailable && availableUnits <= 3 && availableUnits > 0 && (
              <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Only {availableUnits} room{availableUnits > 1 ? 's' : ''} left for these dates!
              </p>
            )}
          </div>

          <div>
            {isAvailable ? (
              <button
                type="button"
                id={`reserve-room-${room._id}`}
                onClick={handleReserve}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Reserve Room</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-400 font-bold text-sm rounded-xl cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
