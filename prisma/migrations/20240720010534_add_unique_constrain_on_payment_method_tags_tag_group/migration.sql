/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,name]` on the table `StoreTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,name]` on the table `StoreTagGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_storeId_name_key" ON "PaymentMethod"("storeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreTag_storeId_name_key" ON "StoreTag"("storeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreTagGroup_storeId_name_key" ON "StoreTagGroup"("storeId", "name");
