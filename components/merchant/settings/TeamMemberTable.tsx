"use client";

import { SettingsCard } from "./shared/SettingsCard";
import { StatusBadge } from "./shared/StatusBadge";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INVITED";
}

const members: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@pizzahut.com",
    role: "OWNER",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@pizzahut.com",
    role: "MANAGER",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@pizzahut.com",
    role: "STAFF",
    status: "INVITED",
  },
];

export function TeamMemberTable() {
  return (
    <SettingsCard
      title="Team Members"
      description="Manage access to your business dashboard"
      action={
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Invite Member
        </button>
      }
    >
      <table className="w-full text-sm">
        <thead className="text-gray-500 font-medium">
          <tr>
            <th className="pb-3 text-left">Member</th>
            <th className="pb-3 text-left">Role</th>
            <th className="pb-3 text-left">Status</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.map((member) => (
            <tr
              key={member.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <StatusBadge
                  status={member.role}
                  variant={
                    member.role.toLowerCase() as "owner" | "manager" | "staff"
                  }
                />
              </td>
              <td className="py-4">
                <StatusBadge
                  status={member.status}
                  variant={member.status === "ACTIVE" ? "active" : "pending"}
                />
              </td>
              <td className="py-4 text-right">
                <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SettingsCard>
  );
}
