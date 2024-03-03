/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EncodedImageData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EncodedImageData_userId_key" ON "EncodedImageData"("userId");
