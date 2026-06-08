-- CreateTable
CREATE TABLE "OfferLetterDocument" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" UUID NOT NULL,
    "invitationId" UUID NOT NULL,

    CONSTRAINT "OfferLetterDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferLetterDocument_companyId_idx" ON "OfferLetterDocument"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferLetterDocument_invitationId_key" ON "OfferLetterDocument"("invitationId");

-- AddForeignKey
ALTER TABLE "OfferLetterDocument" ADD CONSTRAINT "OfferLetterDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferLetterDocument" ADD CONSTRAINT "OfferLetterDocument_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "onboarding_invitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
