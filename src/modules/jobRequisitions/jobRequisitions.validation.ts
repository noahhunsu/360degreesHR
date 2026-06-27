import { TaskResponsibility } from "@prisma/client";
import z from "zod";


export const createJobRequisitionInputSchema = z.object({
   departmentId : z.string(), 
        jobTitle : z.string(), 
        numberOfPositions : z.coerce.number(),
        salaryRangeMax : z.coerce.number(),
        salaryRangeMin : z.coerce.number(),
        reason : z.string(),
        priority : z.string()
})
export const updateJobRequisitionInputSchema = z.object({
        jobTitle : z.string().optional(), 
        numberOfPositions : z.coerce.number().optional(),
        salaryRangeMax : z.coerce.number().optional(),
        salaryRangeMin : z.coerce.number().optional(),
        reason : z.string(),
        priority : z.string()
})
export const acceptOrRejectRequisitionInputSchema = z.object({
        isRejected : z.boolean(),
        rejectionReason : z.string().optional(),
})



export type CreateJobRequisitionInput =
  z.infer<typeof createJobRequisitionInputSchema>;
export type UpdateJobRequisitionInput =
  z.infer<typeof updateJobRequisitionInputSchema>;
export type AcceptOrRejectRequisitionInput =
  z.infer<typeof acceptOrRejectRequisitionInputSchema>;

