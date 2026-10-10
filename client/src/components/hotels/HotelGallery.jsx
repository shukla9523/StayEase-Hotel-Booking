import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const HotelGallery = ({ images = [] }) => {
  const [activeModalIndex, setActiveModalIndex] = useState(null);

  const fallback =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80';
  const displayImages = images.length > 0 ? images : [{ url: fallback, caption: 'Hotel View' }];

  const featured = displayImages[0];
  const sideImages = displayImages.slice(1, 5);

  const openLightbox = (idx) => setActiveModalIndex(idx);
  const closeLightbox = () => setActiveModalIndex(null);

  const nextImage = () => {
    setActiveModalIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setActiveModalIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden bg-slate-100 grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] md:h-[460px]">
        {/* Main large image */}
        <div
          className={`relative cursor-pointer group overflow-hidden ${
            sideImages.length > 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-4'
          } h-full`}
          onClick={() => openLightbox(0)}
        >
          <img
            src={featured.url}
            alt={featured.caption || 'Hotel Featured'}
            onError={(e) => {
              e.currentTarget.src = fallback;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
        </div>

        {/* Side thumbnail grid */}
        {sideImages.map((img, idx) => (
          <div
            key={idx}
            className="relative hidden md:block cursor-pointer group overflow-hidden h-[225px]"
            onClick={() => openLightbox(idx + 1)}
          >
            <img
              src={img.url}
              alt={img.caption || `Gallery ${idx + 2}`}
              onError={(e) => {
                e.currentTarget.src = fallback;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
          </div>
        ))}

        {/* View all button */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl backdrop-blur-md shadow-md flex items-center gap-2 transition-all"
        >
          <ImageIcon className="w-4 h-4 text-teal-600" />
          <span>Show all {displayImages.length} photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl flex justify-between items-center text-white text-sm font-semibold">
            <span>
              Photo {activeModalIndex + 1} of {displayImages.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex items-center justify-center max-w-5xl max-h-[75vh] w-full my-auto">
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 sm:-left-12 p-3 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={displayImages[activeModalIndex].url}
              alt={displayImages[activeModalIndex].caption}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 sm:-right-12 p-3 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {displayImages[activeModalIndex].caption && (
            <p className="text-slate-300 text-xs sm:text-sm text-center max-w-xl">
              {displayImages[activeModalIndex].caption}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default HotelGallery;
