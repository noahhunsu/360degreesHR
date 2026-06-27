import {
  CandidateDocumentType,
  EmploymentType,
  TaskResponsibility,
} from "@prisma/client";
import z from "zod";

export const createJobApplicationSchema = z.object({
  jobOpeningId: z.uuid(),

  firstName: z.string().trim().min(2, "First name is required"),

  lastName: z.string().trim().min(2, "Last name is required"),

  email: z.email(),

  phoneNumber: z.string().trim().min(5, "Phone number is required").optional(),

  documents: z
    .array(
      z.object({
        documentType: z.enum(CandidateDocumentType),

        fileName: z.string(),

        storageKey: z.string(),

        mimeType: z.string(),
      }),
    )
    .min(1, "At least one document must be uploaded"),
});

 export const getPresignedUrlInputForApplicationSchema = z.object({
    fileName: z.string(),
      mimeType: z.string(),
      documentType: z.string()
  })

  export const moveJobApplicationInputSchema = z.object({
    applicationId : z.string(),
    stageId : z.string(),
    notes : z.string().optional()
  })

export const rejectJobApplicationInputSchema =z.object({

  applicationId: z.string(),
  reason: z.string(),
})
export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
export type GetPresignedUrlInputForApplicationInput = z.infer<
  typeof getPresignedUrlInputForApplicationSchema
>;
export type MoveJobApplicationInput = z.infer<
  typeof moveJobApplicationInputSchema
>;
export type RejectJobApplicationInput = z.infer<
  typeof rejectJobApplicationInputSchema
>;
