-- CreateTable
CREATE TABLE "GraphData_Temp" (
    "id" SERIAL NOT NULL, "label" TEXT NOT NULL, "xLabel" TEXT NOT NULL DEFAULT 'Time', "yLabel" TEXT NOT NULL DEFAULT 'Value', CONSTRAINT "GraphData_Temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraphDataValues_Temp" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "graphDataId" INTEGER NOT NULL,


CONSTRAINT "GraphDataValues_Temp_pkey" PRIMARY KEY ("id") );

-- AddForeignKey
ALTER TABLE "GraphDataValues_Temp"
ADD CONSTRAINT "GraphDataValues_Temp_graphDataId_fkey" FOREIGN KEY ("graphDataId") REFERENCES "GraphData_Temp" ("id") ON DELETE CASCADE ON UPDATE CASCADE;