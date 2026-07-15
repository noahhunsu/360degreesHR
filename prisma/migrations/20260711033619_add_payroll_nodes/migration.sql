/*
  Warnings:

  - Changed the type of `expression` on the `payroll_rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payroll_rules" DROP COLUMN "expression",
ADD COLUMN     "expression" JSONB NOT NULL;
