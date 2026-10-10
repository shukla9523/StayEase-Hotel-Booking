import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Shield,
  Calendar,
  Users,
  CheckCircle,
  MessageSquare,
  Share2,
  Heart,
  Loader2,
  ArrowRight,
  Info,
} from 'lucide-react';
import HotelGallery from '../components/hotels/HotelGallery';
import RoomCard from '../components/hotels/RoomCard';
import RatingBadge from '../components/hotels/RatingBadge';
import AmenityIcon from '../components/hotels/AmenityIcon';
import EmptyState from '../components/common/EmptyState';
import hotelService from '../services/hotelService';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';

export const HotelDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    nights,
  } = useSearch();

  const [hotel, setHotel] = useState(null);
  const [evaluatedRooms, setEvaluatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await hotelService.getHotelById(id);
        if (res.success && res.hotel) {
          setHotel(res.hotel);
          setEvaluatedRooms(res.hotel.rooms || []);
        } else {
          setError('Hotel not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load hotel.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  // Check real-time date availability across rooms
  useEffect(() => {
    if (!hotel?._id || !checkIn || !checkOut) return;

    const checkRealTimeAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        const res = await hotelService.checkAvailability(hotel._id, {
          checkIn,
          checkOut,
          adults,
          children: childrenCount,
        });

        if (res.success && res.rooms) {
          setEvaluatedRooms(res.rooms);
        }
      } catch (err) {
        console.warn('Real-time availability check fallback:', err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    checkRealTimeAvailability();
  }, [hotel?._id, checkIn, checkOut, adults, childrenCount]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Loading hotel details & verified rates...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <EmptyState
          title="Hotel Unavailable"
          description={error || 'The requested hotel could not be found or is temporarily offline.'}
          actionText="Back to All Hotels"
          actionLink="/hotels"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/" className="hover:text-teal-600">Home</Link>
              <span>/</span>
              <Link to={`/hotels?city=${hotel.city}`} className="hover:text-teal-600">
                Hotels in {hotel.city}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-bold truncate max-w-[200px]">{hotel.name}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {hotel.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-slate-700 ml-1">{hotel.starRating}-Star {hotel.propertyType}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{hotel.address}, {hotel.city}, {hotel.state}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <RatingBadge rating={hotel.averageRating} reviewCount={hotel.reviewCount} />
          </div>
        </div>

        {/* Gallery */}
        <HotelGallery images={hotel.images} />

        {/* Dynamic Stay Dates Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Stay Dates ({nights} night{nights > 1 ? 's' : ''})
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mt-0.5">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-hidden text-xs"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Guests
                </p>
                <p className="text-xs font-bold text-slate-900">
                  {adults} Adults · {childrenCount} Children
                </p>
              </div>
            </div>
          </div>

          <a
            href="#available-rooms"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>View Available Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Content Layout: Overview & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">About the Property</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                {hotel.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900">Hotel Amenities & Perks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(hotel.amenities || []).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/60"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white text-teal-600 flex items-center justify-center shadow-2xs shrink-0">
                      <AmenityIcon name={amenity} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Availability Section */}
            <div id="available-rooms" className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Available Room Types</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Select a room to proceed to checkout and secure instant booking
                  </p>
                </div>
                {availabilityLoading && (
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking inventory...</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {evaluatedRooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    hotelId={hotel._id}
                    isAvailable={room.isAvailable !== false}
                    availableUnits={room.availableUnits ?? 5}
                  />
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-black text-slate-900">Guest Reviews</h2>
                </div>
                <RatingBadge rating={hotel.averageRating} reviewCount={hotel.reviewCount} />
              </div>

              <div className="divide-y divide-slate-100">
                {(hotel.reviews || []).length > 0 ? (
                  hotel.reviews.map((rev) => (
                    <div key={rev._id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                            {rev.userName ? rev.userName[0] : 'G'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                            <p className="text-[10px] text-slate-400">
                              Verified Stay · {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {rev.title && (
                        <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">
                    No reviews yet. Be the first to book and share your stay experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Location Map & Policies */}
          <div className="space-y-6 sticky top-28">
            {/* Location & Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" /> Location & Coordinates
              </h3>

              <div className="h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 mb-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">{hotel.name}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                  {hotel.address}, {hotel.city}
                </p>
                {hotel.coordinates?.latitude && hotel.coordinates?.longitude ? (
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-1">
                    Lat: {hotel.coordinates.latitude}, Lng: {hotel.coordinates.longitude}
                  </span>
                ) : null}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Address:</p>
                <p>{hotel.address}</p>
                <p>{hotel.city}, {hotel.state} {hotel.country}</p>
              </div>
            </div>

            {/* Check-in Policies */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600" /> Good to Know
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Check-in</span>
                  <span className="font-bold text-slate-800">From 14:00 (2:00 PM)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Check-out</span>
                  <span className="font-bold text-slate-800">Until 11:00 (11:00 AM)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Cancellation</span>
                  <span className="font-bold text-emerald-600">Free on selected rooms</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Front Desk</span>
                  <span className="font-bold text-slate-800">24/7 Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
