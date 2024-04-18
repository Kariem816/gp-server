/*
  Warnings:

  - You are about to drop the `GraphDataValues_Temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GraphData_Temp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GraphDataValues_Temp" DROP CONSTRAINT "GraphDataValues_Temp_graphDataId_fkey";

-- DropTable
DROP TABLE "GraphDataValues_Temp";

-- DropTable
DROP TABLE "GraphData_Temp";
