import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import HotelCard from '../components/hotels/HotelCard';
import FilterSidebar from '../components/hotels/FilterSidebar';
import { HotelCardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import hotelService from '../services/hotelService';
import { useSearch } from '../context/SearchContext';

export const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { nights } = useSearch();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search & Filter State
  const cityParam = searchParams.get('city') || '';
  const [searchInput, setSearchInput] = useState(cityParam);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recommended');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [filters, setFilters] = useState({
    maxPrice: Number(searchParams.get('maxPrice')) || 25000,
    starRating: searchParams.get('stars')
      ? searchParams.get('stars').split(',').map(Number)
      : [],
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null,
    propertyType: searchParams.get('propertyType')
      ? searchParams.get('propertyType').split(',')
      : [],
    amenities: searchParams.get('amenities')
      ? searchParams.get('amenities').split(',')
      : [],
  });

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        city: cityParam,
        search: searchInput,
        sortBy,
        page: currentPage,
        limit: 9,
      };

      if (filters.maxPrice < 25000) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.propertyType.length > 0) params.propertyType = filters.propertyType.join(',');
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');

      const res = await hotelService.getHotels(params);
      if (res.success) {
        let filteredHotels = res.hotels || [];

        // In-memory filter for stars if specified
        if (filters.starRating.length > 0) {
          filteredHotels = filteredHotels.filter((h) =>
            filters.starRating.includes(h.starRating)
          );
        }

        setHotels(filteredHotels);
        setTotalCount(res.total || filteredHotels.length);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  }, [cityParam, searchInput, sortBy, currentPage, filters]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Synchronize state with URL search params
  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams({ city: searchInput, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      maxPrice: 25000,
      starRating: [],
      minRating: null,
      propertyType: [],
      amenities: [],
    });
    setSearchInput('');
    setSortBy('recommended');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <MapPin className="w-4 h-4 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search city, hotel name, or landmark (e.g. Jaipur, Taj, Goa)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="submit"
                className="flex-1 md:flex-initial px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-2xl shadow-xs transition-colors"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Open Filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Header: Count & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {cityParam ? `Hotels in ${cityParam}` : 'All Hotels & Stays in India'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Showing {hotels.length} of {totalCount} verified properties available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
            </span>
            <select
              id="sort-hotels-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden focus:border-teal-500 cursor-pointer shadow-2xs"
            >
              <option value="recommended">StayEase Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Guest Rating</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar + Hotels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Hotel Results Cards */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <EmptyState
                  title="No hotels match your filters"
                  description="We couldn't find any stays matching your selected criteria. Try resetting price, stars, or amenities filters to view all available luxury stays."
                  actionText="Reset All Filters"
                  onAction={handleResetFilters}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full ml-auto shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <span className="font-extrabold text-slate-900 text-lg">Filter Hotels</span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                isMobileDrawer={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
