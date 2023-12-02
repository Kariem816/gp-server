-- CreateTable
CREATE TABLE "TrashCan" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrashCan_pkey" PRIMARY KEY ("id")
);
