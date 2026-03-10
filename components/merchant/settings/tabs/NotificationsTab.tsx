// import { Mail, Smartphone, Shield } from "lucide-react";
// import { SettingsCard } from "../shared/SettingsCard";
// import { ToggleRow } from "../shared/ToggleRow";

// export function NotificationsTab() {
//   return (
//     <div className="space-y-6">
//       <SettingsCard
//         title="Email Notifications"
//         description="Receive updates about orders and account activity"
//         icon={Mail}
//       >
//         <div className="space-y-2">
//           <ToggleRow
//             label="New Order Alerts"
//             description="When a customer places a new order"
//             defaultChecked={true}
//           />
//           <ToggleRow
//             label="Daily Summary"
//             description="Daily report of sales and activity"
//             defaultChecked={true}
//           />
//           <ToggleRow
//             label="Low Stock Warnings"
//             description="When product inventory runs low"
//             defaultChecked={true}
//           />
//         </div>
//       </SettingsCard>

//       <SettingsCard
//         title="WhatsApp Notifications"
//         description="Automated messages sent to your business number"
//         icon={Smartphone}
//       >
//         <div className="space-y-2">
//           <ToggleRow
//             label="Order Confirmations"
//             description="Instant alerts for new orders"
//             defaultChecked={true}
//           />
//           <ToggleRow
//             label="Customer Support Alerts"
//             description="When customers request human assistance"
//             defaultChecked={true}
//           />
//         </div>
//       </SettingsCard>

//       <SettingsCard title="Automation Settings" icon={Shield}>
//         <div className="space-y-4">
//           <ToggleRow
//             label="Auto-Confirm Orders"
//             description="Automatically confirm orders under $50"
//             defaultChecked={false}
//           />
//           <div className="flex items-center justify-between py-2">
//             <div>
//               <p className="text-sm font-medium text-gray-900">
//                 Low Stock Threshold
//               </p>
//               <p className="text-xs text-gray-500">
//                 Alert when stock falls below
//               </p>
//             </div>
//             <input
//               type="number"
//               defaultValue={5}
//               className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>
//       </SettingsCard>
//     </div>
//   );
// }
