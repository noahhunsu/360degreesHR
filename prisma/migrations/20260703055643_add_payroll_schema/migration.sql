/*
  Warnings:

  - Changed the column `workingDays` on the `LeavePolicy` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'LOCKED', 'PAID');

-- AlterTable
ALTER TABLE "LeavePolicy"
DROP COLUMN "workingDays";

ALTER TABLE "LeavePolicy"
ADD COLUMN "workingDays" "WeekDay"[] NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedById" UUID NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_items" (
    "id" UUID NOT NULL,
    "payrollRunId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "grossPay" DECIMAL(18,2) NOT NULL,
    "totalEarnings" DECIMAL(18,2) NOT NULL,
    "totalDeductions" DECIMAL(18,2) NOT NULL,
    "netPay" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_breakdown" (
    "id" UUID NOT NULL,
    "payrollItemId" UUID NOT NULL,
    "salaryComponentId" UUID,
    "name" TEXT NOT NULL,
    "type" "SalaryComponentType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "taxable" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_companyId_month_year_key" ON "payroll_runs"("companyId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_items_payrollRunId_employeeId_key" ON "payroll_items"("payrollRunId", "employeeId");

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_breakdown" ADD CONSTRAINT "payroll_breakdown_payrollItemId_fkey" FOREIGN KEY ("payrollItemId") REFERENCES "payroll_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_breakdown" ADD CONSTRAINT "payroll_breakdown_salaryComponentId_fkey" FOREIGN KEY ("salaryComponentId") REFERENCES "salary_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;
