-- CreateTable
CREATE TABLE "SmartSpot" (
    "id" TEXT NOT NULL,
    "poly" JSONB NOT NULL,
    "location" TEXT NOT NULL,
    "isEmpty" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SmartSpot_pkey" PRIMARY KEY ("id")
);
