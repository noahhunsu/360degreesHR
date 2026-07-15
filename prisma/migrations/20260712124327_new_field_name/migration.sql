/*
  Warnings:

  - Added the required column `componentName` to the `payroll_breakdowns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payroll_breakdowns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payroll_breakdowns" ADD COLUMN     "componentName" TEXT NOT NULL,
ADD COLUMN     "type" "ComponentCalculationType" NOT NULL;
