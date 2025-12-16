'use client';

import React from 'react';

const TaskSkeleton = () => {
  return (
    <div className="">
      {/* Scrollable skeleton list */}
      <div className="space-y-1.5">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="p-2 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all duration-150 h-16 flex flex-col justify-center space-y-2"
          >
            <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskSkeleton;
