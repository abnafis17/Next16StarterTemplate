import React from "react";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface PriorityStyle {
  bg: string;
  text: string;
  border: string;
}

const priorityStyles: Record<Priority, PriorityStyle> = {
  LOW: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  MEDIUM: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
  HIGH: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
};

export const usePriorityBadge = (priority: Priority) => {
  const style = priorityStyles[priority];

  const Badge = (
    <div
      className={`w-fit my-1 px-2 py-0.5 text-xs font-normal rounded-full border ${style.bg} ${style.text} ${style.border}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
    </div>
  );

  return Badge;
};
