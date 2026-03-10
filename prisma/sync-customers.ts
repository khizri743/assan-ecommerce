import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄 Syncing Customer stats...");

  const customers = await prisma.customer.findMany();

  for (const customer of customers) {
    // 1. Aggregate real data from the Order table
    const stats = await prisma.order.aggregate({
      where: {
        customerId: customer.id,
        status: { not: "CANCELLED" }, // Don't count cancelled orders in spend
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    // 2. Update the customer record
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: stats._count.id,
        totalSpent: stats._sum.totalAmount || 0,
      },
    });

    console.log(
      `Updated ${customer.name}: ${stats._count.id} orders, $${stats._sum.totalAmount}`,
    );
  }

  console.log("✅ Sync complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
