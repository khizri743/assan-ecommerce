import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

interface AdminLayoutProps {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export function AdminLayout({
  children,
  onSearch,
  searchValue,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav onSearch={onSearch} searchValue={searchValue} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
