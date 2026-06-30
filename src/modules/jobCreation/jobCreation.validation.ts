import { EmploymentType, JobOpeningDocumentType, TaskResponsibility } from "@prisma/client";
import z from "zod";

export const createJobOpeningSchema = z.object({
  requisitionId: z
    .string()
    .uuid("Invalid requisition ID"),

  title: z
    .string()
    .trim()
    .min(3, "Title is required")
    .max(255),

  description: z
    .string()
    .trim()
    .min(10, "Description is required"),

  location: z
    .string()
    .trim()
    .max(255)
    .optional(),

  employmentType: z.enum(EmploymentType),

  salaryMin: z
    .number()
    .nonnegative()
    .optional(),

  salaryMax: z
    .number()
    .nonnegative()
    .optional(),

  settings: z.object({
    numberOfOpenings: z
      .number()
      .int()
      .positive(),

    openingDate: z
      .coerce
      .date()
      .optional(),

    expiryDate: z
      .coerce
      .date()
      .optional(),

    evaluationScale: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(5),
  }),

  hiringTeam: z
    .array(
      z.object({
        userId: z
          .string()
          .uuid("Invalid user ID"),

        role: z.enum([
          "HIRING_MANAGER",
          "RECRUITER",
          "INTERVIEWER",
        ]),
      }),
    )
    .min(
      1,
      "At least one hiring team member is required",
    ),

    jobOpeningDocuments :  z
    .array(
      z.object({
        name: z
          .enum(JobOpeningDocumentType),
          

        isRequired: z.boolean(),
      }),
    ),
  stages: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(2)
          .max(100),

        position: z
          .number()
          .int()
          .positive(),

        isRequired: z
          .boolean()
          .optional()
          .default(true),
      }),
    )
    .min(
      1,
      "At least one hiring stage is required",
    ),
})
.superRefine((data, ctx) => {
  // salary validation
  if (
    data.salaryMin &&
    data.salaryMax &&
    data.salaryMin > data.salaryMax
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salaryMax"],
      message:
        "Maximum salary must be greater than minimum salary",
    });
  }

  // date validation
  if (
    data.settings.openingDate &&
    data.settings.expiryDate &&
    data.settings.expiryDate <=
      data.settings.openingDate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["settings", "expiryDate"],
      message:
        "Expiry date must be after opening date",
    });
  }

  // exactly one hiring manager
  const hiringManagers =
    data.hiringTeam.filter(
      (member) =>
        member.role === "HIRING_MANAGER",
    );

  if (hiringManagers.length !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["hiringTeam"],
      message:
        "Exactly one hiring manager is required",
    });
  }

  // unique stage positions
  const positions =
    data.stages.map(
      (stage) => stage.position,
    );

  const uniquePositions =
    new Set(positions);

  if (
    uniquePositions.size !==
    positions.length
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["stages"],
      message:
        "Stage positions must be unique",
    });
  }
});



export const updateJobOpeningInputSchema = z.object({
  title: z.string().optional(),

  description: z.string().optional(),

  location: z.string().optional(),

  employmentType: z
    .enum(EmploymentType)
    .optional(),

  salaryMin: z.number().optional(),

  salaryMax: z.number().optional(),

  settings: z
    .object({
      numberOfOpenings:
        z.number().optional(),

      openingDate:
        z.coerce.date().optional(),

      expiryDate:
        z.coerce.date().optional(),

      evaluationScale:
        z.number().optional(),
    })
    .optional(),

  hiringTeam: z
    .array(
      z.object({
        userId: z.string(),

        role: z.enum([
          "HIRING_MANAGER",
          "RECRUITER",
          "INTERVIEWER",
        ]),
      }),
    )
    .optional(),
     jobOpeningDocuments :  z
    .array(
      z.object({
        name: z
          .enum(JobOpeningDocumentType),
          

        isRequired: z.boolean(),
      }),
    ).optional(),

  stages: z
    .array(
      z.object({
        name: z.string(),

        position: z.number(),

        isRequired:
          z.boolean(),
      }),
    )
    .optional(),
});

export const getPresignedUrlInputForApplicationSchema = z.object({
  fileName: z.string(),
    mimeType: z.string(),
    documentType: z.string()
})

export type CreateJobOpeningInput =
  z.infer<typeof createJobOpeningSchema>;


export type UpdateJobOpeningInput =
  z.infer<typeof updateJobOpeningInputSchema>;

export type GetPresignedUrlInputForApplication =
  z.infer<typeof getPresignedUrlInputForApplicationSchema>;






