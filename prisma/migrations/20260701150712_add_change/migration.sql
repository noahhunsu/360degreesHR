/*
  Warnings:

  - Added the required column `effectiveFrom` to the `employee_compensations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employee_compensations_employeeId_componentId_key";

-- AlterTable
ALTER TABLE "employee_compensations" ADD COLUMN     "effectiveFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "effectiveTo" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "employee_compensations_employeeId_idx" ON "employee_compensations"("employeeId");

-- CreateIndex
CREATE INDEX "employee_compensations_componentId_idx" ON "employee_compensations"("componentId");
