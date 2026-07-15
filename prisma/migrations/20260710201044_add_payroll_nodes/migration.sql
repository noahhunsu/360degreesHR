/*
  Warnings:

  - The values [PERCENTAGE] on the enum `ComponentCalculationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `percentageValue` on the `payroll_components` table. All the data in the column will be lost.
  - You are about to drop the column `referenceComponentId` on the `payroll_components` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ComponentCalculationType_new" AS ENUM ('FIXED', 'FORMULA', 'EXTERNAL');
ALTER TABLE "payroll_components" ALTER COLUMN "calculationType" TYPE "ComponentCalculationType_new" USING ("calculationType"::text::"ComponentCalculationType_new");
ALTER TYPE "ComponentCalculationType" RENAME TO "ComponentCalculationType_old";
ALTER TYPE "ComponentCalculationType_new" RENAME TO "ComponentCalculationType";
DROP TYPE "public"."ComponentCalculationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payroll_components" DROP CONSTRAINT "payroll_components_referenceComponentId_fkey";

-- AlterTable
ALTER TABLE "payroll_components" DROP COLUMN "percentageValue",
DROP COLUMN "referenceComponentId";
