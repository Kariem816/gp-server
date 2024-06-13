/*
  Warnings:

  - You are about to drop the `SmartSpot` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ParkingSpot" ADD COLUMN     "isSmart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "poly" JSONB;

-- DropTable
DROP TABLE "SmartSpot";
