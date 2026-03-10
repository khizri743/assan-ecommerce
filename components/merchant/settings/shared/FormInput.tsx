// import { cn } from "@/lib/utils";

// interface FormInputProps {
//   label: string;
//   defaultValue?: string;
//   type?: string;
//   prefix?: string;
//   placeholder?: string;
// }

// export function FormInput({
//   label,
//   defaultValue,
//   type = "text",
//   prefix,
//   placeholder,
// }: FormInputProps) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1.5">
//         {label}
//       </label>
//       <div className="relative">
//         {prefix && (
//           <span className="absolute right-3 top-2.5 text-sm text-gray-400 font-mono">
//             {prefix}
//           </span>
//         )}
//         <input
//           type={type}
//           defaultValue={defaultValue}
//           placeholder={placeholder}
//           className={cn(
//             "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all",
//             prefix && "pl-[140px]",
//           )}
//         />
//       </div>
//     </div>
//   );
// }

import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  defaultValue?: string;
  type?: string;
  postfix?: string; // or keep it as 'prefix' if you prefer that name
  placeholder?: string;
  className?: string; // Add this to allow specific overrides
}

export function FormInput({
  label,
  defaultValue,
  type = "text",
  postfix,
  placeholder,
  className,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {/* flex container makes sure input and postfix sit side-by-side */}
      <div className="flex items-center w-full bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
        <input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          // Combine base styles with the custom className (like text-right)
          className={cn(
            "flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none border-none",
            className,
          )}
        />
        {postfix && (
          <span className="pr-3 text-sm text-gray-400 font-mono whitespace-nowrap bg-white pointer-events-none">
            {postfix}
          </span>
        )}
      </div>
    </div>
  );
}
