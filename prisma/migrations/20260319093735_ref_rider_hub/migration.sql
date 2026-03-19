/*
  Warnings:

  - You are about to drop the column `coverage` on the `riders` table. All the data in the column will be lost.
  - Added the required column `hubId` to the `riders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "riders" DROP COLUMN "coverage",
ADD COLUMN     "hubId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "riders" ADD CONSTRAINT "riders_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "hubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
