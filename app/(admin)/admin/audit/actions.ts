"use server";

import prisma from "@/lib/prisma";

export async function getAuditLogs() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Limit for performance
  });

  return logs.map((log) => ({
    id: log.id,
    timestamp: log.createdAt.toISOString(),
    admin: {
      name: log.actorEmail.split("@")[0], // Simple fallback if name not stored
      email: log.actorEmail,
    },
    action: log.action,
    targetType: log.entityType,
    targetName: log.entityName || "Unknown",
    targetId: log.entityId,
    ipAddress: log.ipAddress || "N/A",
    details: log.details || "No details provided",
    severity: log.severity.toLowerCase() as "info" | "warning" | "critical",
  }));
}

// Helper to record an audit log (to be used by other actions)
export async function createAuditLog(data: {
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  actorEmail: string;
  details?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}) {
  await prisma.auditLog.create({
    data: {
      ...data,
      severity: data.severity || "INFO",
    },
  });
}
