import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/merchant/Sidebar";
import { TopNav } from "@/components/merchant/Topnav";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Verify Session
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  // 2. Fetch User & Business Data
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: { business: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <TopNav user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
