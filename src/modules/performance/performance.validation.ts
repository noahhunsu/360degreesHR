import {
  PerformanceAssignmentType,
  PerformanceNodeType,
  PerformanceReviewerType,
  PerformanceReviewFrequency,
  PerformanceReviewStatus,
  PerformanceScoreType,
  PerformanceSubjectType,
} from "@prisma/client";
import * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                            TEMPLATE NODE SCHEMA                            */
/* -------------------------------------------------------------------------- */

const performanceNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(1),

    description: z.string().optional(),

    type: z.enum(PerformanceNodeType),

    children: z.array(performanceNodeSchema).default([]),
  }),
);

/* -------------------------------------------------------------------------- */
/*                           CREATE TEMPLATE SCHEMA                           */
/* -------------------------------------------------------------------------- */

export const performanceTemplateSchema = z.object({
  name: z.string().min(3),

  description: z.string().optional(),

  reviewFrequency: z.enum(PerformanceReviewFrequency),

  nodes: z.array(performanceNodeSchema).min(1),
});

/* -------------------------------------------------------------------------- */
/*                          UPDATE TEMPLATE SCHEMA                            */
/* -------------------------------------------------------------------------- */

const updatePerformanceNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(1).optional(),

    description: z.string().optional(),

    type: z.enum(PerformanceNodeType).optional(),

    children: z.array(updatePerformanceNodeSchema).default([]).optional(),
  }),
);

export const updatePerformanceTemplateSchema = z.object({
  name: z.string().optional(),

  description: z.string().optional(),

  reviewFrequency: z.enum(PerformanceReviewFrequency).optional(),

  nodes: z.array(updatePerformanceNodeSchema).optional(),
});

/* -------------------------------------------------------------------------- */
/*                         PERFORMANCE REVIEW NODE                            */
/* -------------------------------------------------------------------------- */

const performanceReviewNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(1),

    description: z.string().optional(),

    type: z.enum(PerformanceNodeType),

    weight: z.coerce.number().positive(),

    scoreType: z.enum(PerformanceScoreType).optional(),

    maximumScore: z.coerce.number().positive().optional(),

    children: z.array(performanceReviewNodeSchema).default([]),
  }),
);

/* -------------------------------------------------------------------------- */
/*                           ASSIGNMENT TARGET                                */
/* -------------------------------------------------------------------------- */

export const performanceAssignmentSchema = z.object({
  type: z.enum(PerformanceAssignmentType),

  id: z.string().uuid(),
});

/* -------------------------------------------------------------------------- */
/*                               REVIEWERS                                    */
/* -------------------------------------------------------------------------- */

export const performanceReviewerTypeSchema = z.object({
  type: z.enum(PerformanceReviewerType),

  weight: z.coerce.number().positive().default(1),
});

/* -------------------------------------------------------------------------- */
/*                              REVIEW SCHEMA                                 */
/* -------------------------------------------------------------------------- */

export const performanceReviewSchema = z
  .object({
    reviewName: z.string().min(3),

    description: z.string().optional(),

    startDate: z.coerce.date(),

    dueDate: z.coerce.date(),

    status: z
      .enum(PerformanceReviewStatus)
      .default("DRAFT"),

    nodes: z.array(performanceReviewNodeSchema).min(1),

    assign: z
      .object({
        targets: z.array(performanceAssignmentSchema).min(1),

        reviewers: z.array(performanceReviewerTypeSchema).min(1),
      })
      .optional(),
  })
  .refine((data) => data.dueDate > data.startDate, {
    message: "Due date must be after start date.",
    path: ["dueDate"],
  });

/* -------------------------------------------------------------------------- */
/*                     REVIEW INSTANCE (OPTIONAL INPUT)                        */
/* -------------------------------------------------------------------------- */

export const performanceReviewInstanceSchema = z.object({
  subjectType: z.enum(PerformanceSubjectType),

  departmentId: z.string().uuid().optional(),

  employeeId: z.string().uuid().optional(),

  managerId: z.string().uuid().optional(),
});

/* -------------------------------------------------------------------------- */
/*                 UPDATE REVIEW INSTANCE                        */
/* -------------------------------------------------------------------------- */

export const updateMyReviewSchema = z.object({
  isDraft : z.boolean(),
  overallComment : z.string().optional(),
  scores : z.array(z.object({
    reviewNodeId : z.string(),
    score : z.coerce.number(),
    comment : z.string().optional()
  })), 
  attachments : z.array(z.object({
    description: z.string().optional(),
    documentType : z.string(),
    originalFileName : z.string(), 
    mimeType : z.string(), 
    storageKey : z.string()
  })).optional()
})
/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type PerformanceTemplateInput = z.infer<
  typeof performanceTemplateSchema
>;

export type UpdatePerformanceTemplateInput = z.infer<
  typeof updatePerformanceTemplateSchema
>;

export type PerformanceReviewInput = z.infer<
  typeof performanceReviewSchema
>;

export type PerformanceAssignmentInput = z.infer<
  typeof performanceAssignmentSchema
>;

export type PerformanceReviewerTypeInput = z.infer<
  typeof performanceReviewerTypeSchema
>;

export type PerformanceReviewNodeInput = z.infer<
  typeof performanceReviewNodeSchema
>;

export type PerformanceReviewInstanceInput = z.infer<
  typeof performanceReviewInstanceSchema
>;
export type UpdateMyReviewInput = z.infer<
  typeof updateMyReviewSchema
>;