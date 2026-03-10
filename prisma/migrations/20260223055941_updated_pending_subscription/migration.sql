/*
  Warnings:

  - You are about to drop the column `pendingPlanProofUrl` on the `businesses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "pendingPlanProofUrl",
ADD COLUMN     "paymentProofUrl" TEXT;
