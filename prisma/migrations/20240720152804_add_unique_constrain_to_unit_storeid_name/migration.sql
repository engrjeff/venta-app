/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unit_storeId_name_key" ON "Unit"("storeId", "name");
