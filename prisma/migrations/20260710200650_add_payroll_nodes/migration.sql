/*
  Warnings:

  - You are about to drop the `payroll_breakdown` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salary_components` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PayrollComponentType" AS ENUM ('EARNING', 'DEDUCTION', 'EMPLOYER_CONTRIBUTION', 'INFORMATIONAL');

-- CreateEnum
CREATE TYPE "ComponentCalculationType" AS ENUM ('FIXED', 'PERCENTAGE', 'FORMULA', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ExternalCalculationProvider" AS ENUM ('SALARY_ADVANCE', 'LOAN', 'ATTENDANCE', 'OVERTIME', 'BONUS', 'COMMISSION');

-- CreateEnum
CREATE TYPE "PayrollOperation" AS ENUM ('CONSTANT', 'COMPONENT', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MIN', 'MAX', 'ABS', 'NEGATE', 'ROUND', 'CEILING', 'FLOOR', 'PERCENTAGE');

-- DropForeignKey
ALTER TABLE "employee_compensations" DROP CONSTRAINT "employee_compensations_componentId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_breakdown" DROP CONSTRAINT "payroll_breakdown_payrollItemId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_breakdown" DROP CONSTRAINT "payroll_breakdown_salaryComponentId_fkey";

-- DropForeignKey
ALTER TABLE "salary_components" DROP CONSTRAINT "salary_components_companyId_fkey";

-- DropTable
DROP TABLE "payroll_breakdown";

-- DropTable
DROP TABLE "salary_components";

-- DropEnum
DROP TYPE "SalaryComponentType";

-- CreateTable
CREATE TABLE "payroll_components" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "componentType" "PayrollComponentType" NOT NULL,
    "calculationType" "ComponentCalculationType" NOT NULL,
    "fixedValue" DECIMAL(18,2),
    "percentageValue" DECIMAL(18,6),
    "referenceComponentId" UUID,
    "ruleId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_rules" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_rule_nodes" (
    "id" UUID NOT NULL,
    "ruleId" UUID NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "operation" "PayrollOperation" NOT NULL,
    "constantValue" DECIMAL(18,6),
    "componentId" UUID,
    "leftNodeId" UUID,
    "rightNodeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_rule_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_breakdowns" (
    "id" UUID NOT NULL,
    "payrollItemId" UUID NOT NULL,
    "componentId" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payroll_components_companyId_name_key" ON "payroll_components"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_rules_companyId_name_key" ON "payroll_rules"("companyId", "name");

-- AddForeignKey
ALTER TABLE "payroll_components" ADD CONSTRAINT "payroll_components_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_components" ADD CONSTRAINT "payroll_components_referenceComponentId_fkey" FOREIGN KEY ("referenceComponentId") REFERENCES "payroll_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_components" ADD CONSTRAINT "payroll_components_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "payroll_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_rules" ADD CONSTRAINT "payroll_rules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_rule_nodes" ADD CONSTRAINT "payroll_rule_nodes_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "payroll_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_rule_nodes" ADD CONSTRAINT "payroll_rule_nodes_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "payroll_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_rule_nodes" ADD CONSTRAINT "payroll_rule_nodes_leftNodeId_fkey" FOREIGN KEY ("leftNodeId") REFERENCES "payroll_rule_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_rule_nodes" ADD CONSTRAINT "payroll_rule_nodes_rightNodeId_fkey" FOREIGN KEY ("rightNodeId") REFERENCES "payroll_rule_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_breakdowns" ADD CONSTRAINT "payroll_breakdowns_payrollItemId_fkey" FOREIGN KEY ("payrollItemId") REFERENCES "payroll_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_breakdowns" ADD CONSTRAINT "payroll_breakdowns_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "payroll_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
