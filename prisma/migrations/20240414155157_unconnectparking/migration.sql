/*
  Warnings:

  - You are about to drop the column `userId` on the `ParkingSpot` table. All the data in the column will be lost.
  - You are about to drop the column `licensePlate` on the `User` table. All the data in the column will be lost.
  - Added the required column `location` to the `ParkingSpot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParkingSpot" DROP CONSTRAINT "ParkingSpot_userId_fkey";

-- DropIndex
DROP INDEX "ParkingSpot_userId_key";

-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "userId",
ADD COLUMN     "location" TEXT NOT NULL;