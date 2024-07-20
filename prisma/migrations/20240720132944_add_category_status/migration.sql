-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';
