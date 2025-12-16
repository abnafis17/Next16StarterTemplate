'use client';

import React from 'react';

interface StatusButtonProps {
  status: string;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status }) => {
  if (!status) return null;

  const _status = status.toLowerCase();

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500 hover:bg-blue-600 text-white',
    contacted: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    qualified: 'bg-green-500 hover:bg-green-600 text-white',
    proposal: 'bg-purple-500 hover:bg-purple-600 text-white',
    closed: 'bg-red-500 hover:bg-red-600 text-white',
    active: 'bg-green-600 hover:bg-green-500 text-white font-semibold',
    inactive: 'bg-secondary hover:bg-red-500 text-black font-semibold',
    pending: 'bg-orange-500 hover:bg-orange-600 text-white',
    completed: 'bg-teal-500 hover:bg-teal-600 text-white',
    cancelled: 'bg-red-500 hover:bg-red-600 text-white',
    approved: 'bg-green-500 hover:bg-green-600 text-white',
    rejected: 'bg-red-500 hover:bg-red-600 text-white',
    accepted: 'bg-green-500 hover:bg-green-600 text-white',
  };

  const colorClasses = statusColors[_status] || 'bg-gray-500 text-white';

  return (
    <div
      className={`px-2 flex items-center gap-x-2 text-xs py-1 w-fit rounded-full transition-colors duration-200 ${colorClasses}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default StatusButton;
