-- CreateTable
CREATE TABLE "LectureImage" (
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT "LectureImage_pkey" PRIMARY KEY ("key") );

-- CreateIndex
CREATE UNIQUE INDEX "LectureImage_url_key" ON "LectureImage" ("url");

-- AddForeignKey
ALTER TABLE "LectureImage"
ADD CONSTRAINT "LectureImage_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture" ("id") ON DELETE CASCADE ON UPDATE CASCADE;