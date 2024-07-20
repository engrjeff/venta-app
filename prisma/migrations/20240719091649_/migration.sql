/*
  Warnings:

  - A unique constraint covering the columns `[storeId,unitId,name]` on the table `UnitConversion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `to` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UnitConversion_storeId_name_key";

-- AlterTable
ALTER TABLE "UnitConversion" ADD COLUMN     "to" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UnitConversion_storeId_unitId_name_key" ON "UnitConversion"("storeId", "unitId", "name");
