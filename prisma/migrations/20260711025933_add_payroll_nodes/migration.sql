/*
  Warnings:

  - You are about to drop the `payroll_rule_nodes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expression` to the `payroll_rules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payroll_rule_nodes" DROP CONSTRAINT "payroll_rule_nodes_componentId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_rule_nodes" DROP CONSTRAINT "payroll_rule_nodes_leftNodeId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_rule_nodes" DROP CONSTRAINT "payroll_rule_nodes_rightNodeId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_rule_nodes" DROP CONSTRAINT "payroll_rule_nodes_ruleId_fkey";

-- DropForeignKey
ALTER TABLE "payroll_rules" DROP CONSTRAINT "payroll_rules_companyId_fkey";

-- AlterTable
ALTER TABLE "payroll_rules" ADD COLUMN     "expression" TEXT NOT NULL;

-- DropTable
DROP TABLE "payroll_rule_nodes";

-- AddForeignKey
ALTER TABLE "payroll_rules" ADD CONSTRAINT "payroll_rules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
