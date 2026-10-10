import React from 'react';

export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse flex flex-col">
      <div className="h-56 bg-slate-200 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-md w-1/4" />
            <div className="h-5 bg-slate-200 rounded-full w-12" />
          </div>
          <div className="h-6 bg-slate-200 rounded-md w-3/4" />
          <div className="h-4 bg-slate-200 rounded-md w-1/2" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-slate-200 rounded-md w-16" />
          <div className="h-6 bg-slate-200 rounded-md w-16" />
          <div className="h-6 bg-slate-200 rounded-md w-16" />
        </div>
        <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 rounded-md w-12" />
            <div className="h-6 bg-slate-200 rounded-md w-24" />
          </div>
          <div className="h-10 bg-slate-200 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-slate-200 rounded-md flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default { HotelCardSkeleton, TableSkeleton };
