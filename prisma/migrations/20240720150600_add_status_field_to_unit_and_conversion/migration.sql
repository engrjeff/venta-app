-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "UnitConversion" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';
