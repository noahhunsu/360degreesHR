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




export type CreateSalaryAdvanceInput = z.infer<
  typeof createSalaryAdvanceSchema
>;