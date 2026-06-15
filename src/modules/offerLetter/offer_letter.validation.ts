

import z from "zod"

export const createPresignedUrlForOfferUploads = z.object(
    {
  "fileName": z.string(),
  "mimeType": z.string(),
  "documentType": z.string()
}
)
export const offerLetterSchema = z.object(
    {
      "storageKey" : z.string(),
  "fileName": z.string(),
  "mimeType": z.string(),
  "documentType": z.string()
}
)


export type GetPresignedUrlForOfferInput =
  z.infer<
    typeof createPresignedUrlForOfferUploads
  >;
export type OfferLetterTemplateInput =
  z.infer<
    typeof offerLetterSchema
  >;



  

export const allowedMimeTypes = [
  "application/pdf",

  "image/jpeg",
  "image/jpg",

  "image/png",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];