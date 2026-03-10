-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "subscriptionEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStart" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
