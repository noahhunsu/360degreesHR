-- DropForeignKey
ALTER TABLE "payroll_breakdowns" DROP CONSTRAINT "payroll_breakdowns_componentId_fkey";

-- AlterTable
ALTER TABLE "payroll_breakdowns" ALTER COLUMN "componentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payroll_breakdowns" ADD CONSTRAINT "payroll_breakdowns_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "payroll_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;
