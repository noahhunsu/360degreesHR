/*
  Warnings:

  - You are about to drop the column `employeeId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,employeeCode]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN');

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_employeeId_fkey";

-- DropIndex
DROP INDEX "users_employeeId_key";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "managerId" UUID,
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "hireDate" DROP NOT NULL,
ALTER COLUMN "hireDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "employeeId";

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE INDEX "employees_managerId_idx" ON "employees"("managerId");

-- CreateIndex
CREATE INDEX "employees_employmentStatus_idx" ON "employees"("employmentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "employees_companyId_employeeCode_key" ON "employees"("companyId", "employeeCode");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
