

import z from "zod"

export const createPresignedUrl = z.object(
    {
  "token": z.string(),
  "fileName": z.string(),
  "mimeType": z.string(),
  "documentType": z.string()
}
)
export const createPresignedUrlForOfferUploads = z.object(
    {
  "fileName": z.string(),
  "mimeType": z.string(),
  "documentType": z.string()
}
)

export type GetPresignedUrlInput =
  z.infer<
    typeof createPresignedUrl
  >;
export type GetPresignedUrlForOfferInput =
  z.infer<
    typeof createPresignedUrlForOfferUploads
  >;



  

export const allowedMimeTypes = [
  "application/pdf",

  "image/jpeg",
  "image/jpg",

  "image/png",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];