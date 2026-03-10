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
  initialData?: any; // If present, we are Editing
}

export function StaffModal({ isOpen, onClose, initialData }: StaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  // Sync state when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Load existing permissions
        setPermissions(initialData.permissions || DEFAULT_PERMISSIONS);
      } else {
        // Reset to default for new user
        setPermissions(DEFAULT_PERMISSIONS);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEditing = !!initialData;
  const isOwner = initialData?.role === "OWNER";

  const handlePermissionChange = (module: ModuleKey, level: AccessLevel) => {
    setPermissions((prev: any) => ({
      ...prev,
      [module]: level,
    }));
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                defaultValue={initialData?.name}
                required
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                defaultValue={initialData?.email}
                required
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password{" "}
                {isEditing && (
                  <span className="text-xs text-gray-400 font-normal">
                    (Leave blank to keep)
                  </span>
                )}
              </label>
              <input
                name="password"
                required={!isEditing}
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={isEditing ? "••••••••" : ""}
              />
            </div>

            {!isOwner && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Title
                </label>
                <select
                  name="role"
                  defaultValue={initialData?.role || "STAFF"}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="STAFF">Staff</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
            )}
          </div>

          {/* PERMISSION MATRIX (Hide for Owner) */}
          {!isOwner && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Access Permissions
              </h3>
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
                            className="h-4 w-4 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <input
                            type="radio"
                            name={key}
                            checked={permissions[key] === "READ"}
                            onChange={() => handlePermissionChange(key, "READ")}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <input
                            type="radio"
                            name={key}
                            checked={permissions[key] === "WRITE"}
                            onChange={() =>
                              handlePermissionChange(key, "WRITE")
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
          >
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? "Update Member" : "Create Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
