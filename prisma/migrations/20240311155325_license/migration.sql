/*
  Warnings:

  - You are about to drop the column `liscensePlate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "liscensePlate",
ADD COLUMN     "licensePlate" TEXT;
