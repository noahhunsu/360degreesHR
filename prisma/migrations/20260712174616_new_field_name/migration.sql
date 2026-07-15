/*
  Warnings:

  - Changed the type of `type` on the `payroll_breakdowns` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payroll_breakdowns" DROP COLUMN "type",
ADD COLUMN     "type" "PayrollComponentType" NOT NULL;
