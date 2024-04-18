/*
  Warnings:

  - Added the required column `location` to the `Light` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Light" ADD COLUMN     "location" TEXT NOT NULL;
