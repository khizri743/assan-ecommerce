import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  return prisma.user.findUnique({
    where: { id: session.userId as string },
    include: { business: true },
  });
}

// 1. For Page Access (Redirects if fail)
export async function requirePermission(
  module: string,
  level: "READ" | "WRITE",
) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "OWNER") return user;

  const perms = user.permissions as any;
  const userLevel = perms?.[module] || "NONE";

  if (userLevel === "NONE") redirect("/dashboard");
  if (level === "WRITE" && userLevel === "READ") redirect("/dashboard");

  return user;
}

// 2. For Server Actions (Throws Error if fail)
export async function verifyActionPermission(module: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  if (user.role === "OWNER") return user;

  const perms = user.permissions as any;
  const userLevel = perms?.[module] || "NONE";

  if (userLevel !== "WRITE") {
    throw new Error(`You do not have permission to edit ${module}.`);
  }

  return user;
}
