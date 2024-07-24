-- DropForeignKey
ALTER TABLE "ProductBundleItem" DROP CONSTRAINT "ProductBundleItem_productId_fkey";

-- AlterTable
ALTER TABLE "ProductBundleItem" ADD COLUMN     "productServiceItemId" TEXT;

-- AddForeignKey
ALTER TABLE "ProductBundleItem" ADD CONSTRAINT "ProductBundleItem_productServiceItemId_fkey" FOREIGN KEY ("productServiceItemId") REFERENCES "ProductServiceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
