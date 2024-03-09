/*
  Warnings:

  - You are about to drop the column `url` on the `LectureImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[img]` on the table `LectureImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `img` to the `LectureImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LectureImage_url_key";

-- AlterTable
ALTER TABLE "LectureImage" DROP COLUMN "url",
ADD COLUMN     "img" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LectureImage_img_key" ON "LectureImage"("img");
