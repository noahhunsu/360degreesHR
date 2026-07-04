-- DropForeignKey
ALTER TABLE "payroll_breakdown" DROP CONSTRAINT "payroll_breakdown_payrollItemId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_items" DROP CONSTRAINT "payroll_items_payrollRunId_fkey";

-- AlterTable
ALTER TABLE "LeavePolicy" ALTER COLUMN "workingDays" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_breakdown" ADD CONSTRAINT "payroll_breakdown_payrollItemId_fkey" FOREIGN KEY ("payrollItemId") REFERENCES "payroll_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
