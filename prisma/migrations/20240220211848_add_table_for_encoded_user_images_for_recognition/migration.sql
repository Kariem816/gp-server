-- CreateTable
CREATE TABLE "EncodedImageData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "EncodedImageData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EncodedImageData" ADD CONSTRAINT "EncodedImageData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
