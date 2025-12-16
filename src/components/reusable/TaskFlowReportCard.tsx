"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { motion } from "framer-motion";

interface StatusItem {
  label: string;
  count: number;
  colorClass: string; // e.g., 'bg-blue-100 text-blue-700'
}

interface TaskFlowReportCardProps {
  title: string;
  total: number | string;
  icon: React.ReactNode;
  statuses: StatusItem[];
  backgroundColor?: string;
  iconBgColor?: string;
  textColor?: string;
  cardBorder?: string;
}

export function TaskFlowReportCard({
  title,
  total,
  icon,
  statuses,
  backgroundColor = "bg-slate-50",
  iconBgColor = "bg-slate-100",
  textColor = "text-gray-700",
  cardBorder = "border-[1px] border-gray-200",
}: TaskFlowReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className={clsx(
          "p-5 rounded-xl shadow-sm transition-shadow",
          backgroundColor,
          "min-w-60 h-full",
          cardBorder
        )}
      >
        <div className="flex justify-between items-start">
          {/* Left Section */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className={clsx("text-sm font-medium", textColor)}>
                {title}
              </h3>
              {/* Right Icon */}
              <motion.div
                className={clsx("rounded-full p-2", iconBgColor)}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {icon}
              </motion.div>
            </div>
            <div className={clsx("text-3xl font-bold", textColor)}>{total}</div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {statuses.map((status, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 bg-opacity-80",
                    status.colorClass
                  )}
                  style={{ marginBottom: "6px" }}
                >
                  <span className="font-bold">{status.count}</span>
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default TaskFlowReportCard;
