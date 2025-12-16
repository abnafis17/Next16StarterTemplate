import React from 'react';

interface ShimmerProps {
  className?: string;
}

// 🔹 Section title shimmer
export const TitleShimmer: React.FC<ShimmerProps> = ({ className = '' }) => (
  <div className={`ml-5 my-2 ${className}`}>
    <div className="h-6 w-48 bg-gray-300 rounded-md animate-pulse" />
  </div>
);

// 🔹 Stat card shimmer
export const ShimmerCard: React.FC<ShimmerProps> = ({ className = '' }) => (
  <div className={`p-4 border rounded-lg shadow bg-white animate-pulse mt-4 ${className}`}>
    <div className="h-4 w-28 bg-gray-200 rounded mb-3"></div>
    <div className="h-6 w-16 bg-gray-300 rounded mb-3"></div>
    <div className="h-3 w-24 bg-gray-200 rounded"></div>
  </div>
);

// 🔹 Chart shimmer (supports col-span)
export const ShimmerChart: React.FC<ShimmerProps> = ({ className = '' }) => (
  <div className={`p-4 border rounded-lg shadow bg-white animate-pulse ${className}`}>
    <div className="h-[300px] bg-gray-200 rounded"></div>
  </div>
);

// 🔹 Pie chart shimmer
export const ShimmerPieCard: React.FC<ShimmerProps> = ({ className = '' }) => (
  <div
    className={`flex-shrink-0 bg-white shadow-md rounded-lg p-4 border border-gray-200 animate-pulse ${className}`}
  >
    <div className="h-[200px] w-40 bg-gray-200 rounded"></div>
  </div>
);

// ✅ Export all
const Shimmers = {
  TitleShimmer,
  ShimmerCard,
  ShimmerChart,
  ShimmerPieCard,
};

export default Shimmers;
