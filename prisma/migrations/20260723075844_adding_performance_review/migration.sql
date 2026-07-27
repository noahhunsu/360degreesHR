-- CreateEnum
CREATE TYPE "PerformanceAssignmentType" AS ENUM ('COMPANY', 'DEPARTMENT', 'POSITION', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "PerformanceReviewStatus" AS ENUM ('DRAFT', 'ASSIGNED', 'REVIEWED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PerformanceSubjectType" AS ENUM ('EMPLOYEE', 'DEPARTMENT', 'TEAM', 'BRANCH', 'POSITION', 'COMPANY');

-- CreateEnum
CREATE TYPE "ReviewInstanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "PerformanceReviewStatus" NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReviewInstance" (
    "id" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "subjectType" "PerformanceSubjectType" NOT NULL,
    "employeeId" UUID,
    "departmentId" UUID,
    "managerId" UUID,
    "status" "ReviewInstanceStatus" NOT NULL,
    "overallScore" DECIMAL(65,30),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PerformanceReviewInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_review_comments" (
    "id" UUID NOT NULL,
    "reviewInstanceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_review_attachments" (
    "id" UUID NOT NULL,
    "reviewInstanceId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,
    "documentType" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_review_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReviewScore" (
    "id" UUID NOT NULL,
    "instanceId" UUID NOT NULL,
    "reviewNodeId" UUID NOT NULL,
    "score" DECIMAL(65,30),
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceReviewScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_review_nodes" (
    "id" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "parentId" UUID,
    "type" "PerformanceNodeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "scoreType" "PerformanceScoreType",
    "maximumScore" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_review_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_review_assignments" (
    "id" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "assignmentType" "PerformanceAssignmentType" NOT NULL,
    "departmentId" UUID,
    "employeeId" UUID,
    "positionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_review_assignments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewInstance" ADD CONSTRAINT "PerformanceReviewInstance_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "performance_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewInstance" ADD CONSTRAINT "PerformanceReviewInstance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewInstance" ADD CONSTRAINT "PerformanceReviewInstance_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewInstance" ADD CONSTRAINT "PerformanceReviewInstance_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_comments" ADD CONSTRAINT "performance_review_comments_reviewInstanceId_fkey" FOREIGN KEY ("reviewInstanceId") REFERENCES "PerformanceReviewInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_comments" ADD CONSTRAINT "performance_review_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_attachments" ADD CONSTRAINT "performance_review_attachments_reviewInstanceId_fkey" FOREIGN KEY ("reviewInstanceId") REFERENCES "PerformanceReviewInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_attachments" ADD CONSTRAINT "performance_review_attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewScore" ADD CONSTRAINT "PerformanceReviewScore_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "PerformanceReviewInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReviewScore" ADD CONSTRAINT "PerformanceReviewScore_reviewNodeId_fkey" FOREIGN KEY ("reviewNodeId") REFERENCES "performance_review_nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_nodes" ADD CONSTRAINT "performance_review_nodes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "performance_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_nodes" ADD CONSTRAINT "performance_review_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "performance_review_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_review_assignments" ADD CONSTRAINT "performance_review_assignments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "performance_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
