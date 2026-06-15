import { EmploymentType, Gender } from "@prisma/client";
import z from "zod";

// enum Status {
//   UNDER_REVIEW,
//   APPROVED,
//   REJECTED,
//   COMPLETED
// }


export const createOnboardingInvitationSchema =
  z.object({
    email: z.email(),

    templateId: z.uuid(),

    departmentId : z.uuid(),
    jobTitle : z.string(),
    compensation : z.coerce.number().positive(),
    managerId : z.uuid().optional(),
    employmentType : z.enum(EmploymentType),

    expiresInDays: z.coerce
      .number()
      .min(1)
      .max(30)
      .default(7),
  });
export const getOnboardingInvitationSchema =
  z.object({
    token : z.string()
  });

export const onboardingDocumentSchema =
  z.object({
    documentType: z
      .string()
      .min(1, "Document type is required"),

    originalFileName: z
      .string()
      .min(1, "Original file name is required"),

    storageKey: z
      .string()
      .min(1, "Storage key is required"),

    mimeType: z
      .string()
      .min(1, "Mime type is required"),

    fileSize: z
      .number()
      .positive("File size must be greater than 0"),
  });

export const onboardingActionSubmissionSchema =
  z.object({
    status : z.string(),
    rejectionReason : z.string().max(5).optional()
  });

  export const saveOnboardingSubmissionSchema =
  z.object({
    token: z
      .string()
      .min(1, "Invitation token is required"),

    firstName: z
      .string()
      .min(1, "First name is required"),

    lastName: z
      .string()
      .min(1, "Last name is required"),

    phoneNumber: z
      .string()
      .optional(),

    address: z
      .string()
      .optional(),

    dateOfBirth: z
      .coerce
      .date()
      .optional(),

    emergencyContactName: z
      .string()
      .optional(),

    emergencyContactPhone: z
      .string()
      .optional(),

    documents: z
      .array(onboardingDocumentSchema)
      .default([]),

    isDraft: z
      .boolean()
      .default(true),
    gender : z.enum(Gender)
  });

  export const getOnboardingSubmissionSchema = z.object({
    submissionId : z.string()
  })

export type SaveOnboardingSubmissionInput =
  z.infer<
    typeof saveOnboardingSubmissionSchema
  >;
export type CreateOnboardingInvitationInput =
  z.infer<
    typeof createOnboardingInvitationSchema
  >;
export type GetOnboardingInvitationInput =
  z.infer<
    typeof getOnboardingInvitationSchema
  >;
export type SaveOnboardingInvitationInput =
  z.infer<
    typeof saveOnboardingSubmissionSchema
  >;
export type GetOnboardingSubmissionInput =
  z.infer<
    typeof getOnboardingSubmissionSchema
  >;
export type OnboardingActionInput =
  z.infer<
    typeof onboardingActionSubmissionSchema
  >;