/*
  Warnings:

  - You are about to drop the column `managerId` on the `PerformanceReviewInstance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PerformanceReviewInstance" DROP CONSTRAINT "PerformanceReviewInstance_managerId_fkey";

-- AlterTable
ALTER TABLE "PerformanceReviewInstance" DROP COLUMN "managerId";
