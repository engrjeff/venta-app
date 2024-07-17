/*
  Warnings:

  - You are about to drop the column `from` on the `UnitConversion` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `UnitConversion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId,name]` on the table `UnitConversion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ProductServiceType" ADD VALUE 'INVENTORY_ASSEMBLY';

-- AlterTable
ALTER TABLE "ProductServiceItem" ADD COLUMN     "unitConversionId" TEXT;

-- AlterTable
ALTER TABLE "UnitConversion" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UnitConversion_storeId_name_key" ON "UnitConversion"("storeId", "name");

-- AddForeignKey
ALTER TABLE "ProductServiceItem" ADD CONSTRAINT "ProductServiceItem_unitConversionId_fkey" FOREIGN KEY ("unitConversionId") REFERENCES "UnitConversion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
