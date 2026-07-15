/*
  Warnings:

  - Made the column `componentId` on table `payroll_breakdowns` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payroll_breakdowns" DROP CONSTRAINT "payroll_breakdowns_componentId_fkey";

-- AlterTable
ALTER TABLE "payroll_breakdowns" ALTER COLUMN "componentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "payroll_breakdowns" ADD CONSTRAINT "payroll_breakdowns_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
