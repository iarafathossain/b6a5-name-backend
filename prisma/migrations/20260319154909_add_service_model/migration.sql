/*
  Warnings:

  - You are about to drop the column `serviceType` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `pricing_rules` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `pricing_rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "serviceType",
ADD COLUMN     "serviceId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "pricing_rules" DROP COLUMN "serviceType",
ADD COLUMN     "serviceId" UUID NOT NULL;

-- DropEnum
DROP TYPE "ServiceType";

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "baseFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "slaHours" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
