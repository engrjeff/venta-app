/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `BookAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "BookAccount_name_idx" ON "BookAccount"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookAccount_storeId_name_key" ON "BookAccount"("storeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_storeId_name_key" ON "Category"("storeId", "name");
