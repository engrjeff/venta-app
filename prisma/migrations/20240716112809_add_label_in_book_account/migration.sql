-- CreateEnum
CREATE TYPE "BookAccountLabel" AS ENUM ('UNCATEGORIZED', 'ASSET', 'INVENTORY', 'INCOME', 'EXPENSE', 'BILL');

-- AlterTable
ALTER TABLE "BookAccount" ADD COLUMN     "label" "BookAccountLabel" NOT NULL DEFAULT 'UNCATEGORIZED';

-- CreateIndex
CREATE INDEX "BookAccount_label_idx" ON "BookAccount"("label");
