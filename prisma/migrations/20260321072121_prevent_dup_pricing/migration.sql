/*
  Warnings:

  - A unique constraint covering the columns `[originalZoneId,destinationZoneId,categoryId,speedId,methodId]` on the table `pricing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pricing_originalZoneId_destinationZoneId_categoryId_speedId_key" ON "pricing"("originalZoneId", "destinationZoneId", "categoryId", "speedId", "methodId");
