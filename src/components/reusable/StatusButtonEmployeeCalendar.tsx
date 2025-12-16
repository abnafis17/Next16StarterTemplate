'use client';

import React from 'react';

interface StatusButtonProps {
  status: string;
}

const statusColorsHex: Record<string, { bg: string; hover: string; text: string }> = {
  accepted: { bg: '#0EA5E9', hover: '#0284C7', text: '#FFFFFF' }, // cyan-500 → cyan-600
  declined: { bg: '#7F1D1D', hover: '#450A0A', text: '#FFFFFF' }, // deep red → burgundy tone
  default: { bg: '#6B7280', hover: '#4B5563', text: '#FFFFFF' }, // gray-500 → gray-600
  developer_completed: { bg: '#16A34A', hover: '#15803D', text: '#FFFFFF' }, // green-600 → green-700
  in_progress: { bg: '#1E3A8A', hover: '#172554', text: '#FFFFFF' }, // deep royal blue
  pending: { bg: '#D97706', hover: '#B45309', text: '#FFFFFF' }, // amber-600 → amber-700
  pending_overdue: { bg: '#DC2626', hover: '#991B1B', text: '#FFFFFF' }, // red-600 → red-800
  pm_accept: { bg: '#065F46', hover: '#064E3B', text: '#FFFFFF' }, // deep emerald green
  qc_completed: { bg: '#8B5CF6', hover: '#7C3AED', text: '#FFFFFF' }, // violet-500 → violet-600
};

const StatusButtonEmployeeCalendar: React.FC<StatusButtonProps> = ({ status }) => {
  if (!status) return null;

  const _status = status.toLowerCase();
  const colorSet = statusColorsHex[_status] || statusColorsHex['default'];

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Employee Accepted';
      case 'declined':
        return 'Declined';
      case 'default':
        return 'Default';
      case 'developer_completed':
        return 'Employee Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'pending_overdue':
        return 'Pending Overdue';
      case 'pm_accept':
        return 'PM Accepted';
      case 'qc_completed ':
        return 'QC Completed';
      default:
        // fallback: convert to Title Case automatically
        return status
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
    }
  }

  return (
    <div
      className="px-2 flex items-center gap-x-2 text-xs py-1 w-fit rounded-full transition-colors duration-200 cursor-pointer whitespace-nowrap"
      style={{ backgroundColor: colorSet.bg, color: colorSet.text }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colorSet.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colorSet.bg)}
    >
      {getStatusLabel(status.toLowerCase())}
    </div>
  );
};

export default StatusButtonEmployeeCalendar;
