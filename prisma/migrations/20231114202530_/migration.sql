/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,semester]` on the table `CourseProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseProfile_studentId_courseId_semester_key" ON "CourseProfile"("studentId", "courseId", "semester");
