/*
  Warnings:

  - Made the column `categoryId` on table `pricing_rules` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_categoryId_fkey";

-- AlterTable
ALTER TABLE "pricing_rules" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "parcel_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
