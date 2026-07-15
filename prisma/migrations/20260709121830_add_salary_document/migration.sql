-- AlterEnum
ALTER TYPE "AdvanceStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "salary_advance" ADD COLUMN     "rejectedDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "salary_advance_documents" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salaryAdvanceId" UUID NOT NULL,

    CONSTRAINT "salary_advance_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "salary_advance_documents_salaryAdvanceId_idx" ON "salary_advance_documents"("salaryAdvanceId");

-- AddForeignKey
ALTER TABLE "salary_advance_documents" ADD CONSTRAINT "salary_advance_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_advance_documents" ADD CONSTRAINT "salary_advance_documents_salaryAdvanceId_fkey" FOREIGN KEY ("salaryAdvanceId") REFERENCES "salary_advance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
