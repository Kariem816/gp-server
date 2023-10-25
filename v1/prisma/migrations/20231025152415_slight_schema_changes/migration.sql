-- AlterTable
ALTER TABLE "Security" ADD COLUMN     "area" TEXT,
ADD COLUMN     "shifts" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "liscencePlate" TEXT;
