/*
  Warnings:

  - You are about to drop the column `areaId` on the `parcels` table. All the data in the column will be lost.
  - Added the required column `originAreaId` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationAreaId` to the `parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originAreaId` to the `parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_areaId_fkey";

-- DropForeignKey
ALTER TABLE "tracking_logs" DROP CONSTRAINT "tracking_logs_userId_fkey";

-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "originAreaId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "areaId",
ADD COLUMN     "destinationAreaId" UUID NOT NULL,
ADD COLUMN     "originAreaId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_originAreaId_fkey" FOREIGN KEY ("originAreaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_destinationAreaId_fkey" FOREIGN KEY ("destinationAreaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_originAreaId_fkey" FOREIGN KEY ("originAreaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_logs" ADD CONSTRAINT "tracking_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
