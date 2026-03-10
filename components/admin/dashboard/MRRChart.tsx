"use client";

import { useState } from "react";
import { AdminCard } from "../shared/AdminCard";
import { TrendingUp } from "lucide-react";

const mockData = [
  { month: "Jan", mrr: 12000, trials: 45 },
  { month: "Feb", mrr: 14500, trials: 52 },
  { month: "Mar", mrr: 13800, trials: 38 },
  { month: "Apr", mrr: 16200, trials: 61 },
  { month: "May", mrr: 18500, trials: 55 },
  { month: "Jun", mrr: 21400, trials: 72 },
];

export function MRRChart() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const maxMRR = Math.max(...mockData.map((d) => d.mrr));

  return (
    <AdminCard
      title="Monthly Recurring Revenue"
      subtitle="MRR growth over last 6 months"
      icon={TrendingUp}
      action={
        <select className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 6 Months</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
      }
      className="col-span-2"
    >
      <div className="h-64 flex items-end gap-2">
        {mockData.map((data) => {
          const height = (data.mrr / maxMRR) * 100;
          const isHovered = hoveredMonth === data.month;

          return (
            <div
              key={data.month}
              className="flex-1 flex flex-col gap-2 group"
              onMouseEnter={() => setHoveredMonth(data.month)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <div className="relative flex-1 flex items-end">
                <div
                  className="w-full bg-blue-100 rounded-t-lg transition-all duration-300 group-hover:bg-blue-200 relative overflow-hidden"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-600 transition-all duration-300"
                    style={{ height: isHovered ? "100%" : "0%" }}
                  />
                </div>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg p-3 shadow-xl z-10 min-w-[120px]">
                    <p className="text-xs text-gray-500 mb-1">
                      {data.month} 2024
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(data.mrr / 1000).toFixed(1)}k MRR
                    </p>
                    <p className="text-xs text-green-600">
                      {data.trials} new trials
                    </p>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 text-center">
                {data.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-600 rounded-sm" />
          <span className="text-sm text-gray-600">MRR</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-100 rounded-sm" />
          <span className="text-sm text-gray-600">Projected</span>
        </div>
      </div>
    </AdminCard>
  );
}
