-- CreateEnum
CREATE TYPE "PerformanceReviewFrequency" AS ENUM ('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'BIANNUALLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PerformanceTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PerformanceNodeType" AS ENUM ('CATEGORY', 'ITEM');

-- CreateEnum
CREATE TYPE "PerformanceScoreType" AS ENUM ('PERCENTAGE', 'RATING_5', 'RATING_10', 'NUMERIC', 'BOOLEAN');

-- CreateTable
CREATE TABLE "performance_templates" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "reviewFrequency" "PerformanceReviewFrequency" NOT NULL,
    "status" "PerformanceTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_nodes" (
    "id" UUID NOT NULL,
    "templateId" UUID NOT NULL,
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

    CONSTRAINT "performance_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "performance_templates_companyId_name_key" ON "performance_templates"("companyId", "name");

-- AddForeignKey
ALTER TABLE "performance_templates" ADD CONSTRAINT "performance_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_templates" ADD CONSTRAINT "performance_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_nodes" ADD CONSTRAINT "performance_nodes_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "performance_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_nodes" ADD CONSTRAINT "performance_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "performance_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
