import { z } from "zod";

export const createOnboardingTemplateSchema =
  z.object({
    name: z
      .string()
      .min(2, "Template name is required"),

    description: z
      .string()
      .optional(),

    documentRequirements: z
      .array(
        z.object({
          documentType: z
            .string()
            .min(1, "Document type is required"),

          isRequired: z.boolean(),

          description: z
            .string()
            .optional()
        })
      )
      .min(1, "At least one document is required")
  });

  export const updateSingleOnboardingTemplateSchema =
  z.object({
    name: z
      .string()
      .min(2)
      .optional(),

    description: z
      .string()
      .optional(),

    documentRequirements: z
      .array(
        z.object({
          documentType: z
            .string()
            .min(1),

          isRequired: z.boolean(),

          description: z
            .string()
            .optional(),
        })
      )
      .optional(),
  });


export type CreateOnboardingTemplateInput =
  z.infer<typeof createOnboardingTemplateSchema>;
export type UpdateSingleOnboardingTemplateInput =
  z.infer<typeof updateSingleOnboardingTemplateSchema>;