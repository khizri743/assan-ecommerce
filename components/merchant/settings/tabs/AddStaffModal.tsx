"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Shield } from "lucide-react";
import {
  MODULES,
  ModuleKey,
  AccessLevel,
  DEFAULT_PERMISSIONS,
} from "@/lib/permissions";
import {
  createStaffMember,
  updateStaffMember,
} from "@/app/(merchant)/dashboard/settings/tabs/team-actions";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // If passed, we are in Edit Mode
}

export function StaffModal({ isOpen, onClose, initialData }: StaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize permissions: Use existing if editing, else default
  const [permissions, setPermissions] = useState(
    initialData?.permissions || DEFAULT_PERMISSIONS,
  );

  // Reset state when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setPermissions(initialData?.permissions || DEFAULT_PERMISSIONS);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEditing = !!initialData;

  const handlePermissionChange = (module: ModuleKey, level: AccessLevel) => {
    setPermissions((prev: any) => ({ ...prev, [module]: level }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    let res;
    if (isEditing) {
      res = await updateStaffMember(initialData.id, formData, permissions);
    } else {
      res = await createStaffMember(formData, permissions);
    }

    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                name="name"
                required
                defaultValue={initialData?.name}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                required
                type="email"
                defaultValue={initialData?.email}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  required
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
            <div className={isEditing ? "col-span-1" : "col-span-2"}>
              <label className="block text-sm font-medium mb-1">
                Role Title
              </label>
              <select
                name="role"
                defaultValue={initialData?.role || "STAFF"}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
          </div>

          {/* PERMISSION TABLE (Same as before) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3 text-center">No Access</th>
                  <th className="px-4 py-3 text-center">Read Only</th>
                  <th className="px-4 py-3 text-center">Full Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(Object.keys(MODULES) as ModuleKey[]).map((key) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {MODULES[key]}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={key}
                        checked={permissions[key] === "NONE"}
                        onChange={() => handlePermissionChange(key, "NONE")}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={key}
                        checked={permissions[key] === "READ"}
                        onChange={() => handlePermissionChange(key, "READ")}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={key}
                        checked={permissions[key] === "WRITE"}
                        onChange={() => handlePermissionChange(key, "WRITE")}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={(e) =>
              e.currentTarget
                .closest(".bg-white")
                ?.querySelector("form")
                ?.requestSubmit()
            }
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Update Member" : "Create Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
