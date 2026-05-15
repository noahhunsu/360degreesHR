-- CreateEnum
CREATE TYPE "DisciplinaryStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "DisciplinarySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DisciplinaryType" AS ENUM ('WARNING', 'MISCONDUCT', 'LATENESS', 'PERFORMANCE', 'SUSPENSION', 'OTHER');

-- CreateTable
CREATE TABLE "disciplinary_records" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "type" "DisciplinaryType" NOT NULL,
    "severity" "DisciplinarySeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DisciplinaryStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" UUID NOT NULL,
    "resolvedById" UUID,
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplinary_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "disciplinary_records_companyId_idx" ON "disciplinary_records"("companyId");

-- CreateIndex
CREATE INDEX "disciplinary_records_employeeId_idx" ON "disciplinary_records"("employeeId");

-- CreateIndex
CREATE INDEX "disciplinary_records_status_idx" ON "disciplinary_records"("status");

-- AddForeignKey
ALTER TABLE "disciplinary_records" ADD CONSTRAINT "disciplinary_records_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinary_records" ADD CONSTRAINT "disciplinary_records_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinary_records" ADD CONSTRAINT "disciplinary_records_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinary_records" ADD CONSTRAINT "disciplinary_records_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
