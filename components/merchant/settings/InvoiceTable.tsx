"use client";

import { Download, FileText } from "lucide-react";
import { SettingsCard } from "./shared/SettingsCard";
import { StatusBadge } from "./shared/StatusBadge";

// Mock Data - In a real app, pass this via props
const invoices = [
  { id: 1, date: "Jan 1, 2024", amount: 49.0, status: "PAID", ref: "INV-001" },
  { id: 2, date: "Dec 1, 2023", amount: 49.0, status: "PAID", ref: "INV-002" },
];

export function InvoiceTable() {
  return (
    <SettingsCard title="Invoice History" icon={FileText}>
      {invoices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="pb-3 pl-4 text-left font-medium">Date</th>
                <th className="pb-3 text-left font-medium">Amount</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 pr-4 text-right font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pl-4 text-gray-900">{invoice.date}</td>
                  <td className="py-3 text-gray-900 font-medium">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={invoice.status} variant="success" />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No invoices found.</p>
        </div>
      )}
    </SettingsCard>
  );
}
