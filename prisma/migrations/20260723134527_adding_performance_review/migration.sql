/*
  Warnings:

  - You are about to drop the column `instanceId` on the `PerformanceReviewScore` table. All the data in the column will be lost.
  - You are about to drop the column `reviewInstanceId` on the `performance_review_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedById` on the `performance_review_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `reviewInstanceId` on the `performance_review_comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `performance_review_comments` table. All the data in the column will be lost.
  - Added the required column `reviewerId` to the `PerformanceReviewScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `performance_review_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `performance_review_comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PerformanceReviewerType" AS ENUM ('MANAGER', 'SELF', 'PEER', 'HR', 'DEPARTMENT_HEAD', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "PerformanceReviewScore" DROP CONSTRAINT "PerformanceReviewScore_instanceId_fkey";

-- DropForeignKey
ALTER TABLE "performance_review_attachments" DROP CONSTRAINT "performance_review_attachments_reviewInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "performance_review_attachments" DROP CONSTRAINT "performance_review_attachments_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "performance_review_comments" DROP CONSTRAINT "performance_review_comments_reviewInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "performance_review_comments" DROP CONSTRAINT "performance_review_comments_userId_fkey";

-- AlterTable
ALTER TABLE "PerformanceReviewScore" DROP COLUMN "instanceId",
ADD COLUMN     "reviewerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "performance_review_attachments" DROP COLUMN "reviewInstanceId",
DROP COLUMN "uploadedById",
ADD COLUMN     "reviewerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "performance_review_comments" DROP COLUMN "reviewInstanceId",
DROP COLUMN "userId",
ADD COLUMN     "reviewerId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "performance_reviewers" (
    "id" UUID NOT NULL,
    "reviewInstanceId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "reviewerType" "PerformanceReviewerType" NOT NULL,
    "weight" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "status" "ReviewInstanceStatus" NOT NULL DEFAULT 'PENDING',
    "overallScore" DECIMAL(10,2),
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviewers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "performance_reviewers_reviewInstanceId_idx" ON "performance_reviewers"("reviewInstanceId");

-- CreateIndex
CREATE INDEX "performance_reviewers_reviewerId_idx" ON "performance_reviewers"("reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "performance_reviewers_reviewInstanceId_reviewerId_key" ON "performance_reviewers"("reviewInstanceId", "reviewerId");

-- AddForeignKey
ALTER TABLE "performance_review_comments" ADD CONSTRAINT "performance_review_comments_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "performance_reviewers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_attachments" ADD CONSTRAINT "performance_review_attachments_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "performance_reviewers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewScore" ADD CONSTRAINT "PerformanceReviewScore_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "performance_reviewers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviewers" ADD CONSTRAINT "performance_reviewers_reviewInstanceId_fkey" FOREIGN KEY ("reviewInstanceId") REFERENCES "PerformanceReviewInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviewers" ADD CONSTRAINT "performance_reviewers_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
