-- CreateEnum
CREATE TYPE "AdvanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "salary_advance" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "requestedAmount" DECIMAL(18,2) NOT NULL,
    "approvedAmount" DECIMAL(18,2),
    "reason" TEXT,
    "requestedById" UUID NOT NULL,
    "payrollRunId" UUID,
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedById" UUID,
    "status" "AdvanceStatus" NOT NULL DEFAULT 'PENDING',
    "approvedDate" TIMESTAMP(3),
    "reviewComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_advance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "salary_advance" ADD CONSTRAINT "salary_advance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advance" ADD CONSTRAINT "salary_advance_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advance" ADD CONSTRAINT "salary_advance_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advance" ADD CONSTRAINT "salary_advance_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advance" ADD CONSTRAINT "salary_advance_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
