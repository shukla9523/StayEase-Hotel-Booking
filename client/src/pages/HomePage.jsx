import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Award, Headphones } from 'lucide-react';
import HeroSearch from '../components/home/HeroSearch';
import PopularDestinations from '../components/home/PopularDestinations';
import CategoriesSection from '../components/home/CategoriesSection';
import SpecialOffers from '../components/home/SpecialOffers';
import Testimonials from '../components/home/Testimonials';
import HotelCard from '../components/hotels/HotelCard';
import { HotelCardSkeleton } from '../components/common/LoadingSkeleton';
import hotelService from '../services/hotelService';

export const HomePage = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await hotelService.getHotels({ featured: 'true', limit: 6 });
        if (res.success && res.hotels) {
          setFeaturedHotels(res.hotels);
        }
      } catch (err) {
        console.error('Failed to load featured hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Search */}
      <HeroSearch />

      {/* Trust Badges Bar */}
      <div className="bg-white border-y border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  100% Verified Properties
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Inspected for luxury standards and cleanliness
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Transparent Pricing
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Zero hidden resort fees at checkout
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  24/7 Dedicated Support
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Assistance on hand before, during & after stay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Featured Hotels Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-teal-600 block mb-2">
                Handpicked by StayEase
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Featured Luxury Hotels
              </h2>
            </div>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors mt-2 md:mt-0"
            >
              <span>Explore all hotels</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Popular Destinations */}
      <PopularDestinations />

      {/* 4. Categories Section */}
      <CategoriesSection />

      {/* 5. Special Promotional Offers */}
      <SpecialOffers />

      {/* 6. Guest Testimonials */}
      <Testimonials />

      {/* 7. Bottom Call to Action */}
      <section className="py-20 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Plan Your Perfect Getaway</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to experience unforgettable Indian hospitality?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Book now with instant confirmation, free cancellation options, and demo sandbox payment testing.
          </p>

          <div className="pt-2">
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Explore All Hotels</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
