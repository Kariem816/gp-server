/*
  Warnings:

  - You are about to drop the `_CourseProfileToLecture` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CourseProfileToLecture" DROP CONSTRAINT "_CourseProfileToLecture_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseProfileToLecture" DROP CONSTRAINT "_CourseProfileToLecture_B_fkey";

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "ended" TIMESTAMP(3),
ADD COLUMN     "location" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CourseProfileToLecture";

-- CreateTable
CREATE TABLE "LectureAttendees" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "times" TIMESTAMP(3)[],

    CONSTRAINT "LectureAttendees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LectureAttendees_lectureId_studentId_key" ON "LectureAttendees"("lectureId", "studentId");

-- AddForeignKey
ALTER TABLE "LectureAttendees" ADD CONSTRAINT "LectureAttendees_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureAttendees" ADD CONSTRAINT "LectureAttendees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "CourseProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
