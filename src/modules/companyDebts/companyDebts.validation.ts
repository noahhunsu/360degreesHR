import {
  CandidateDocumentType,
  EmploymentType,
  TaskResponsibility,
} from "@prisma/client";
import z from "zod";

export const createSalaryAdvanceSchema = z.object({
  requestedAmount : z.coerce.number(), 
  reason : z.string().optional()
});

export const updateSalaryAdvanceSchema = z.object({
  requestedAmount : z.coerce.number().optional(), 
  reason : z.string().optional()
});
export const cancelSalaryAdvanceSchema = z.object({
  reason : z.string().optional()
});

export const approveOrRejectSalaryAdvanceRequestSchema = z.object({
  reject : z.boolean(),
  rejection_reason : z.string().optional(),
  review_comment : z.string().optional(),
  approvedAmount : z.coerce.number().optional(),
});

export const confirmPaidSalaryAdvanceRequestSchema = z.object({
  fileName : z.string(),
  storageKey : z.string(),
  mimeType : z.string(),
});


 export const getPresignedUrlInputForCompanyDebtsSchema = z.object({
    fileName: z.string(),
      mimeType: z.string(),
      documentType: z.string()
  })

export type ApproveOrRejectSalaryAdvanceRequestInput = z.infer<
  typeof approveOrRejectSalaryAdvanceRequestSchema
>;
export type CreateSalaryAdvanceInput = z.infer<
  typeof createSalaryAdvanceSchema
>;
export type UpdateSalaryAdvanceInput = z.infer<
  typeof updateSalaryAdvanceSchema
>;
export type CancelSalaryAdvanceInput = z.infer<
  typeof cancelSalaryAdvanceSchema
>;

export type ConfirmPaidSalaryAdvanceRequestInput = z.infer<
  typeof confirmPaidSalaryAdvanceRequestSchema
>;

export type GetPresignedUrlInputForCompanyDebtsInput = z.infer<
  typeof getPresignedUrlInputForCompanyDebtsSchema
>;