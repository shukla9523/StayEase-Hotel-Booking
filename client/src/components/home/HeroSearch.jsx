import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const {
    destination,
    setDestination,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    roomsCount,
    setRoomsCount,
  } = useSearch();

  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);

  const popularCities = ['Jaipur', 'Goa', 'Delhi', 'Mumbai', 'Udaipur', 'Manali', 'Kochi', 'Varanasi'];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsGuestPickerOpen(false);
    setIsCitySuggestionsOpen(false);

    const query = new URLSearchParams();
    if (destination.trim()) query.set('city', destination.trim());
    if (checkIn) query.set('checkIn', checkIn);
    if (checkOut) query.set('checkOut', checkOut);
    if (adults) query.set('adults', adults);
    if (childrenCount) query.set('children', childrenCount);
    if (roomsCount) query.set('rooms', roomsCount);

    navigate(`/hotels?${query.toString()}`);
  };

  return (
    <div className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Luxury & Heritage Stays Across India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Find your <span className="text-teal-400">perfect stay.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Immerse yourself in royal Rajputana palaces, tranquil Goan sands, and scenic Himalayan retreats with instant confirmed reservations.
          </p>
        </div>

        {/* Global Search Bar Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/20 text-slate-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Destination Input */}
            <div className="relative md:col-span-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Destination / City
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <input
                  type="text"
                  id="search-destination-input"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setIsCitySuggestionsOpen(true);
                  }}
                  onFocus={() => setIsCitySuggestionsOpen(true)}
                  placeholder="Where are you going? (e.g. Jaipur)"
                  className="w-full text-sm font-bold text-slate-900 bg-transparent focus:outline-hidden placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Suggestions Dropdown */}
              {isCitySuggestionsOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in duration-100"
                  onMouseLeave={() => setIsCitySuggestionsOpen(false)}
                >
                  <p className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px]">
                    Popular Destinations
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setDestination(city);
                          setIsCitySuggestionsOpen(false);
                        }}
                        className="px-3 py-2 rounded-xl text-left font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Check-in & Check-out Dates */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Check-in
                </label>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    id="search-checkin-date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="border-l border-slate-200 pl-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Check-out
                </label>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <input
                    type="date"
                    id="search-checkout-date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Guests & Rooms */}
            <div className="relative md:col-span-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Guests & Rooms
              </label>
              <button
                type="button"
                id="search-guests-toggle"
                onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-hidden"
              >
                <div className="flex items-center gap-2 truncate">
                  <Users className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {adults} Ad, {childrenCount} Ch · {roomsCount} Rm
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Guest Selector Popover */}
              {isGuestPickerOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 space-y-4 animate-in fade-in duration-100"
                  onMouseLeave={() => setIsGuestPickerOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Adults</p>
                      <p className="text-[11px] text-slate-400">Ages 18 or above</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Children</p>
                      <p className="text-[11px] text-slate-400">Ages 0 to 17</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Rooms</p>
                      <p className="text-[11px] text-slate-400">Required rooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{roomsCount}</span>
                      <button
                        type="button"
                        onClick={() => setRoomsCount(Math.min(5, roomsCount + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGuestPickerOpen(false)}
                    className="w-full py-2 bg-teal-600 text-white font-bold text-xs rounded-xl"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Search Submit Button */}
            <div className="md:col-span-1">
              <button
                type="submit"
                id="search-submit-btn"
                className="w-full h-14 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02]"
                aria-label="Search Hotels"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
