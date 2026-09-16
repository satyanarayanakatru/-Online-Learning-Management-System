import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Hero Banner Skeleton */}
      <div className="h-44 bg-emerald-500/10 rounded-3xl border border-emerald-500/20" />

      {/* Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-emerald-500/10 rounded-3xl border border-emerald-500/20" />
        ))}
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-72 bg-emerald-500/10 rounded-3xl border border-emerald-500/20" />
        <div className="h-72 bg-emerald-500/10 rounded-3xl border border-emerald-500/20" />
      </div>
    </div>
  );
}
