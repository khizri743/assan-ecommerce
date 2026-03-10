"use client";

import { useState } from "react";
import {
  Users,
  Lock,
  Crown,
  Mail,
  ShieldCheck,
  Trash2,
  Pencil, // Import Pencil
} from "lucide-react";
import { SettingsCard } from "../shared/SettingsCard";
import { StaffModal } from "./StaffModal"; // Use new modal
import { deleteStaffMember } from "@/app/(merchant)/dashboard/settings/tabs/team-actions";
import { cn } from "@/lib/utils";

interface TeamTabProps {
  business?: { subscriptionPlan: string };
  teamMembers: any[];
}

export function TeamTab({ business, teamMembers }: TeamTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null); // State for member being edited

  const isPro =
    business?.subscriptionPlan === "PRO" ||
    business?.subscriptionPlan === "ENTERPRISE";

  if (!isPro) return <LockedTeamView />;

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      await deleteStaffMember(id);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null); // Reset for create mode
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
          <p className="text-sm text-gray-500">
            Create staff accounts and assign permissions.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Users className="h-4 w-4" /> Add Employee
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Access Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-bold",
                      member.role === "OWNER"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {member.role === "OWNER" ? (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-green-600" /> Full
                      Access
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(member.permissions || {}).map(
                        ([key, val]) =>
                          val === "WRITE" && (
                            <span
                              key={key}
                              className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-1.5 rounded"
                            >
                              {key.toLowerCase()}
                            </span>
                          ),
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Only show actions for non-owners */}
                  {member.role !== "OWNER" && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Permissions"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingMember}
      />
    </div>
  );
}

// ... LockedTeamView ...

// --- LOCKED VIEW (For Free/Basic Users) ---
function LockedTeamView() {
  return (
    <div className="relative space-y-6">
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 border border-gray-200 rounded-xl">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-full mb-4 shadow-sm">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          Unlock Team Management{" "}
          <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        </h3>
        <p className="text-gray-600 max-w-md mb-6">
          Upgrade to the <strong>Pro Plan</strong> to add staff members, assign
          roles (Manager, Staff), and track individual performance.
        </p>

        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all">
          Upgrade to Pro
        </button>
      </div>

      {/* Background Placeholder (Greyed out UI) */}
      <div className="opacity-40 pointer-events-none select-none filter grayscale-[0.5]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Team Management
            </h3>
            <p className="text-sm text-gray-500">Manage access to your store</p>
          </div>
          <div className="bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold">
            Invite Member
          </div>
        </div>

        <SettingsCard title="Team Members" icon={Users}>
          <div className="space-y-4">
            {/* Dummy Rows */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard className="bg-gray-50 border-gray-200 mt-6">
          <div className="flex gap-3">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
