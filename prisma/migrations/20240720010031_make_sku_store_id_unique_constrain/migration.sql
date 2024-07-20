/*
  Warnings:

  - A unique constraint covering the columns `[storeId,sku]` on the table `ProductServiceItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductServiceItem_storeId_sku_key" ON "ProductServiceItem"("storeId", "sku");
