import { z } from "zod";

export const createEmploymentHistorySchema = z.object({
  departmentId: z.uuid().optional(),

  jobTitle: z
    .string()
    .min(2, "Job title is required"),

  startDate: z.coerce.date(),

  endDate: z.coerce.date().optional(),

  isCurrent: z.boolean().default(true)
})
.refine(
  (data) => {
    if (data.endDate) {
      return data.endDate >= data.startDate;
    }

    return true;
  },
  {
    message: "End date cannot be before start date",
    path: ["endDate"]
  }
);

export type CreateEmploymentHistoryInput =
  z.infer<typeof createEmploymentHistorySchema>;