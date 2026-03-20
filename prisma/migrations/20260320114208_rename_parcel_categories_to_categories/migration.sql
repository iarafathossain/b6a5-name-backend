/*
  Warnings:

  - You are about to drop the column `deliveryMethod` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the `parcel_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parcel_tracking_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `methodId` to the `parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speedId` to the `parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parcel_tracking_logs" DROP CONSTRAINT "parcel_tracking_logs_hubId_fkey";

-- DropForeignKey
ALTER TABLE "parcel_tracking_logs" DROP CONSTRAINT "parcel_tracking_logs_parcelId_fkey";

-- DropForeignKey
ALTER TABLE "parcel_tracking_logs" DROP CONSTRAINT "parcel_tracking_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_destinationZoneId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_originalZoneId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_serviceId_fkey";

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "deliveryMethod",
DROP COLUMN "serviceId",
DROP COLUMN "speed",
ADD COLUMN     "methodId" UUID NOT NULL,
ADD COLUMN     "speedId" UUID NOT NULL;

-- DropTable
DROP TABLE "parcel_categories";

-- DropTable
DROP TABLE "parcel_tracking_logs";

-- DropTable
DROP TABLE "pricing_rules";

-- DropTable
DROP TABLE "services";

-- DropEnum
DROP TYPE "DeliveryMethod";

-- DropEnum
DROP TYPE "DeliverySpeed";

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "baseWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "methods" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "baseFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing" (
    "id" UUID NOT NULL,
    "originalZoneId" UUID NOT NULL,
    "destinationZoneId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "speedId" UUID NOT NULL,
    "methodId" UUID NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speeds" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "baseFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "slaHours" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_logs" (
    "id" UUID NOT NULL,
    "parcelId" UUID NOT NULL,
    "status" "ParcelStatus" NOT NULL,
    "hubId" UUID,
    "userId" UUID,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "methods_slug_key" ON "methods"("slug");

-- CreateIndex
CREATE INDEX "idx_pricing_original_zone_id" ON "pricing"("originalZoneId");

-- CreateIndex
CREATE INDEX "idx_pricing_destination_zone_id" ON "pricing"("destinationZoneId");

-- CreateIndex
CREATE UNIQUE INDEX "speeds_slug_key" ON "speeds"("slug");

-- CreateIndex
CREATE INDEX "idx_tracking_log_parcel_id" ON "tracking_logs"("parcelId");

-- CreateIndex
CREATE INDEX "idx_tracking_log_user_id" ON "tracking_logs"("userId");

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_speedId_fkey" FOREIGN KEY ("speedId") REFERENCES "speeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_originalZoneId_fkey" FOREIGN KEY ("originalZoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_destinationZoneId_fkey" FOREIGN KEY ("destinationZoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_speedId_fkey" FOREIGN KEY ("speedId") REFERENCES "speeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_logs" ADD CONSTRAINT "tracking_logs_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_logs" ADD CONSTRAINT "tracking_logs_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_logs" ADD CONSTRAINT "tracking_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
