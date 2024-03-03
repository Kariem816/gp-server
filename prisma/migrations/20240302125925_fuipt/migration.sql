/*
  Warnings:

  - You are about to drop the `EncodedImageData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EncodedImageData" DROP CONSTRAINT "EncodedImageData_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "encodedImageData" TEXT;

-- DropTable
DROP TABLE "EncodedImageData";
