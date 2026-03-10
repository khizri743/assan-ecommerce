"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: ToggleRowProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          checked ? "bg-blue-600" : "bg-gray-200",
        )}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow-sm transition-transform duration-200",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
