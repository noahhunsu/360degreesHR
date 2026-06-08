/*
  Warnings:

  - You are about to drop the `OfferLetterTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfferLetterTemplate" DROP CONSTRAINT "OfferLetterTemplate_companyId_fkey";

-- DropForeignKey
ALTER TABLE "OfferLetterTemplate" DROP CONSTRAINT "OfferLetterTemplate_uploadedById_fkey";

-- DropTable
DROP TABLE "OfferLetterTemplate";

-- CreateTable
CREATE TABLE "offer_letter_templates" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,

    CONSTRAINT "offer_letter_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_letter_templates_companyId_idx" ON "offer_letter_templates"("companyId");

-- AddForeignKey
ALTER TABLE "offer_letter_templates" ADD CONSTRAINT "offer_letter_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_letter_templates" ADD CONSTRAINT "offer_letter_templates_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
