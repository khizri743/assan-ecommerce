"use client";

import { updatePlan } from "@/app/(admin)/admin/plans/actions";
import { Save } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      <Save className="h-4 w-4" /> {pending ? "Saving..." : "Update Plan"}
    </button>
  );
}

export function PlanEditor({ plan }: { plan: any }) {
  const updateWithId = updatePlan.bind(null, plan.id);

  return (
    <form
      action={updateWithId}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">{plan.slug} Plan</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPopular"
            defaultChecked={plan.isPopular}
            className="h-4 w-4 text-black"
          />
          <label className="text-xs text-gray-500">Popular</label>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Display Name
        </label>
        <input
          name="name"
          defaultValue={plan.name}
          className="w-full border p-2 rounded text-black text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Price (PKR)
        </label>
        <input
          type="number"
          name="price"
          defaultValue={Number(plan.price)}
          className="w-full border p-2 rounded text-black text-sm mt-1"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Description
        </label>
        <input
          name="description"
          defaultValue={plan.description}
          className="w-full border p-2 rounded text-black text-sm mt-1"
        />
      </div>

      <div className="flex-1">
        <label className="text-xs font-bold text-gray-500 uppercase">
          Features (One per line)
        </label>
        <textarea
          name="features"
          defaultValue={plan.features.join("\n")}
          className="w-full border p-2 rounded text-black text-sm mt-1 h-32 font-mono"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
