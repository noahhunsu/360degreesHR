/*
  Warnings:

  - The primary key for the `EmploymentHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `companyId` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `EmploymentHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "EmploymentHistory" DROP CONSTRAINT "EmploymentHistory_pkey",
ADD COLUMN     "companyId" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "EmploymentHistory_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employeeId_idx" ON "EmploymentHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmploymentHistory_employeeId_isCurrent_idx" ON "EmploymentHistory"("employeeId", "isCurrent");

-- CreateIndex
CREATE INDEX "EmploymentHistory_isCurrent_idx" ON "EmploymentHistory"("isCurrent");

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
