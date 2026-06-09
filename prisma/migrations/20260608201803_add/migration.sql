/*
  Warnings:

  - You are about to drop the `OfferLetterDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfferLetterDocument" DROP CONSTRAINT "OfferLetterDocument_companyId_fkey";

-- DropForeignKey
ALTER TABLE "OfferLetterDocument" DROP CONSTRAINT "OfferLetterDocument_invitationId_fkey";

-- DropTable
DROP TABLE "OfferLetterDocument";

-- CreateTable
CREATE TABLE "offer_letter_documents" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" UUID NOT NULL,
    "invitationId" UUID NOT NULL,

    CONSTRAINT "offer_letter_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_letter_documents_companyId_idx" ON "offer_letter_documents"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "offer_letter_documents_invitationId_key" ON "offer_letter_documents"("invitationId");

-- AddForeignKey
ALTER TABLE "offer_letter_documents" ADD CONSTRAINT "offer_letter_documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_letter_documents" ADD CONSTRAINT "offer_letter_documents_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "onboarding_invitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
