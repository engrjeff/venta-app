-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_expenseAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_incomeAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_inventoryAssetAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "ProductServiceItem" DROP CONSTRAINT "ProductServiceItem_unitId_fkey";

-- AlterTable
ALTER TABLE "ProductServiceItem" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "inventoryAssetAccountId" DROP NOT NULL,
ALTER COLUMN "incomeAccountId" DROP NOT NULL,
ALTER COLUMN "expenseAccountId" DROP NOT NULL,
ALTER COLUMN "unitId" DROP NOT NULL,
ALTER COLUMN "supplierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_inventoryAssetAccountId_fkey" FOREIGN KEY ("inventoryAssetAccountId") REFERENCES "BookAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_incomeAccountId_fkey" FOREIGN KEY ("incomeAccountId") REFERENCES "BookAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_expenseAccountId_fkey" FOREIGN KEY ("expenseAccountId") REFERENCES "BookAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
