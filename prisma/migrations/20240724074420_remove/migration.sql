/*
  Warnings:

  - The values [BUNDLE] on the enum `ProductServiceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductServiceType_new" AS ENUM ('INVENTORY', 'NON_INVENTORY', 'INVENTORY_ASSEMBLY', 'SERVICE');
ALTER TABLE "ProductServiceItem" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "ProductServiceItem" ALTER COLUMN "type" TYPE "ProductServiceType_new" USING ("type"::text::"ProductServiceType_new");
ALTER TYPE "ProductServiceType" RENAME TO "ProductServiceType_old";
ALTER TYPE "ProductServiceType_new" RENAME TO "ProductServiceType";
DROP TYPE "ProductServiceType_old";
ALTER TABLE "ProductServiceItem" ALTER COLUMN "type" SET DEFAULT 'INVENTORY';
COMMIT;
