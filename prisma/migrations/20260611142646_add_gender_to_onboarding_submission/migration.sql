/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `onboarding_submissions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `jobTitle` on table `onboarding_invitations` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gender` to the `onboarding_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskResponsibility" AS ENUM ('HR', 'DEPARTMENT_MANAGER', 'SPECIFIC_USER');

-- CreateEnum
CREATE TYPE "OnboardingTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "onboarding_invitations" ALTER COLUMN "jobTitle" SET NOT NULL;

-- AlterTable
ALTER TABLE "onboarding_submissions" ADD COLUMN     "employeeId" UUID,
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "onboarding_task_templates" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "responsibility" "TaskResponsibility" NOT NULL,
    "assignedUserId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_task_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_onboarding_tasks" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "templateId" UUID,
    "companyId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToUserId" UUID NOT NULL,
    "status" "OnboardingTaskStatus" NOT NULL DEFAULT 'PENDING',
    "completedById" UUID,
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_onboarding_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_task_templates_companyId_idx" ON "onboarding_task_templates"("companyId");

-- CreateIndex
CREATE INDEX "onboarding_task_templates_isActive_idx" ON "onboarding_task_templates"("isActive");

-- CreateIndex
CREATE INDEX "employee_onboarding_tasks_employeeId_idx" ON "employee_onboarding_tasks"("employeeId");

-- CreateIndex
CREATE INDEX "employee_onboarding_tasks_assignedToUserId_idx" ON "employee_onboarding_tasks"("assignedToUserId");

-- CreateIndex
CREATE INDEX "employee_onboarding_tasks_status_idx" ON "employee_onboarding_tasks"("status");

-- CreateIndex
CREATE INDEX "employee_onboarding_tasks_companyId_idx" ON "employee_onboarding_tasks"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_submissions_employeeId_key" ON "onboarding_submissions"("employeeId");

-- AddForeignKey
ALTER TABLE "onboarding_submissions" ADD CONSTRAINT "onboarding_submissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_task_templates" ADD CONSTRAINT "onboarding_task_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_task_templates" ADD CONSTRAINT "onboarding_task_templates_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_task_templates" ADD CONSTRAINT "onboarding_task_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_onboarding_tasks" ADD CONSTRAINT "employee_onboarding_tasks_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_onboarding_tasks" ADD CONSTRAINT "employee_onboarding_tasks_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "onboarding_task_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_onboarding_tasks" ADD CONSTRAINT "employee_onboarding_tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_onboarding_tasks" ADD CONSTRAINT "employee_onboarding_tasks_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_onboarding_tasks" ADD CONSTRAINT "employee_onboarding_tasks_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
