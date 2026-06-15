import { TaskResponsibility } from "@prisma/client";
import z from "zod";


export const createOnboardingTaskTemplateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  responsibility: z.enum(TaskResponsibility),

  assignedUserId: z
    .uuid()
    .optional(),
})
.refine(
  (data) => {
    if (
      data.responsibility === "SPECIFIC_USER" &&
      !data.assignedUserId
    ) {
      return false;
    }

    return true;
  },
  {
    message:
      "assignedUserId is required when responsibility is SPECIFIC_USER",
    path: ["assignedUserId"],
  }
);

export const createOnboardingTaskSchema = z.object({
  onboardingTaskTemplateId : z.uuid("Invalid UUID Type")
})

export type CreateOnboardingTaskTemplateInput =
  z.infer<typeof createOnboardingTaskTemplateSchema>;


export type CreateOnboardingTaskInput =
  z.infer<typeof createOnboardingTaskSchema>;
