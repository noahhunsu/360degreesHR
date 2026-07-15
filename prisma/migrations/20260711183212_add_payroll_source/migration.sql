/*
  Warnings:

  - Added the required column `valueSource` to the `payroll_components` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ComponentValueSource" AS ENUM ('EMPLOYEE', 'COMPANY', 'FORMULA');

-- AlterTable
ALTER TABLE "payroll_components" ADD COLUMN     "valueSource" "ComponentValueSource" NOT NULL;
