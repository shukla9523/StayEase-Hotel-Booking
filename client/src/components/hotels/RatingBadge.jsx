import React from 'react';
import { Star } from 'lucide-react';

export const RatingBadge = ({ rating = 0, reviewCount, size = 'md' }) => {
  const numericRating = Number(rating) || 0;

  const getLabel = (score) => {
    if (score >= 4.8) return 'Exceptional';
    if (score >= 4.5) return 'Superb';
    if (score >= 4.0) return 'Very Good';
    if (score >= 3.5) return 'Good';
    return 'Pleasant';
  };

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <span className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-teal-600 text-white font-extrabold text-xs">
          {numericRating.toFixed(1)}
        </span>
        {reviewCount !== undefined && (
          <span className="text-[11px] text-slate-500 font-medium">({reviewCount})</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col text-right">
        <span className="text-xs font-bold text-slate-800 leading-tight">
          {getLabel(numericRating)}
        </span>
        {reviewCount !== undefined && (
          <span className="text-[10px] text-slate-400 font-medium">
            {reviewCount} verified reviews
          </span>
        )}
      </div>
      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shadow-xs shadow-teal-600/20">
        {numericRating.toFixed(1)}
      </div>
    </div>
  );
};

export default RatingBadge;
