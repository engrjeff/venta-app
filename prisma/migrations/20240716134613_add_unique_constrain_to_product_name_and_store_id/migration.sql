/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `ProductServiceItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductServiceItem_storeId_name_key" ON "ProductServiceItem"("storeId", "name");
