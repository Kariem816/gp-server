/*
  Warnings:

  - You are about to drop the column `location` on the `ParkingSpot` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ControlElement" ADD VALUE 'waste';
ALTER TYPE "ControlElement" ADD VALUE 'irrigation';
ALTER TYPE "ControlElement" ADD VALUE 'lighting';

-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "location";

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "lastWatered" TIMESTAMP(3) NOT NULL,
    "isWatering" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Light" (
    "id" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL,

    CONSTRAINT "Light_pkey" PRIMARY KEY ("id")
);
