/*
  Warnings:

  - You are about to drop the column `valueSource` on the `payroll_components` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payroll_components" DROP COLUMN "valueSource";

-- DropEnum
DROP TYPE "ComponentValueSource";
