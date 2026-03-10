"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanSelectionCardProps {
  name: string;
  price: number;
  features: string[];
  selected: boolean;
  onSelect: () => void;
  current?: boolean;
}

export function PlanSelectionCard({
  name,
  price,
  features,
  selected,
  onSelect,
  current,
}: PlanSelectionCardProps) {
  return (
    <div
      onClick={!current ? onSelect : undefined}
      className={cn(
        "border rounded-xl p-4 transition-all cursor-pointer relative",
        selected
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 hover:border-blue-300 bg-white",
        current && "opacity-60 cursor-default bg-gray-50",
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-900 uppercase text-sm">{name}</h4>
        {current && (
          <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
            CURRENT
          </span>
        )}
      </div>

      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-extrabold text-gray-900">
          {price === 0 ? "Free" : `Rs ${price.toLocaleString()}`}
        </span>
        {price > 0 && <span className="text-xs text-gray-500 ml-1">/mo</span>}
      </div>

      <ul className="space-y-2">
        {features.slice(0, 3).map(
          (
            feature,
            i, // Show top 3 features
          ) => (
            <li
              key={i}
              className="flex items-center gap-2 text-xs text-gray-600"
            >
              <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
              {feature}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
