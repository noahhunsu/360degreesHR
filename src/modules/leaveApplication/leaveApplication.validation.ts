import { ApprovalFrom, WeekDay } from "@prisma/client";
import z from "zod";

export const createLeaveTypeSchema = z.object({
  name: z.string(),

  description: z.string(),

  daysPerYear: z.coerce.number(),

  isPaid: z.boolean(),
  requiresApproval: z.boolean().optional(),

  requiresDocument: z.boolean().optional(),
  documentType: z.string().optional(),
  approvalFrom: z.enum(ApprovalFrom).optional(),

  minimumMonthsOfService: z.coerce.number().optional(),

  // Notice

  noticePeriodDays: z.coerce.number().optional(),
  // Carry Forward

  allowCarryForward: z.boolean().optional(),

  maxCarryForwardDays: z.coerce.number().optional(),

  // Half Day

  allowHalfDay: z.boolean().optional(),

  // Probation

  availableDuringProbation: z.boolean().optional(),
});
export const updateLeaveTypeInputInputSchema = z.object({
  name: z.string().optional(),

  description: z.string().optional(),

  daysPerYear: z.coerce.number().optional(),

  isPaid: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),

  requiresDocument: z.boolean().optional(),
  documentType: z.string().optional(),
  approvalFrom: z.enum(ApprovalFrom).optional(),
  minimumMonthsOfService: z.coerce.number().optional(),

  // Notice

  noticePeriodDays: z.coerce.number().optional(),
  // Carry Forward

  allowCarryForward: z.boolean().optional(),

  maxCarryForwardDays: z.coerce.number().optional(),

  // Half Day

  allowHalfDay: z.boolean().optional(),

  // Probation

  availableDuringProbation: z.boolean().optional(),
});

export const createOrUpdateEmployeeLeaveBalanceSchema = z.object({
  
  allocatedDays: z.coerce.number().optional(),
});

export const createLeaveRequestSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    reliever: z.string().optional(),
    documents: z
      .array(
        z.object({
          fileName: z.string(),

          storageKey: z.string(),

          mimeType: z.string(),
        }),
      )
      .optional(),
  })
  .refine(
    (date) => {
      // let now = new Date()
      return date.endDate > date.startDate;
    },
    {
      message: "End date cannot be less than start date",
      path: ["endDate"],
    },
  );

export const approveLeaveRequestSchema = z.object({
  comment: z.string().max(500).optional(),
});

export const rejectLeaveRequestSchema = z.object({
  reason: z.string().min(3, "Rejection reason is required").max(500),
});
export const approveLeaveRequestInputSchema = z.object({
  comment: z.string().min(3, "Rejection reason is required").max(500),
});
export const leavePolicyInputSchema = z.object({
  excludeWeekends: z.boolean().optional(),

  excludePublicHolidays: z.boolean().optional(),

  workingDays: z.array(z.enum(WeekDay)).optional(),

  minimumMonthsBeforeLeave: z.coerce.number().min(0).optional(),

  minimumNoticeDays: z.coerce.number().min(0).optional(),

  allowCarryForward: z.boolean().optional(),

  maxCarryForwardDays: z.coerce.number().min(0).optional(),

  allowNegativeBalance: z.boolean().optional(),

  allowLeaveEncashment: z.boolean().optional(),

  allowEmployeeCancellation: z.boolean().optional(),

  cancellationNoticeDays: z.coerce.number().min(0).optional(),

  allowHalfDayLeave: z.boolean().optional(),

  allowLeaveDuringProbation: z.boolean().optional(),
});

const publicHolidaySchema = z.object({
  name: z.string().trim().min(2).max(100),

  date: z.coerce.date(),
});

export const createPublicHolidaySchema = z.object({
  holidays: z.array(publicHolidaySchema).min(1),
});

export const updatePublicHolidaySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  date: z.coerce.date().optional(),
});

export const getPresignedUrlInputForLeaveApplicationSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  documentType: z.string(),
});

export type CreateLeaveTypeInput = z.infer<typeof createLeaveTypeSchema>;
export type CreateOrUpdateEmployeeLeaveBalanceInput = z.infer<
  typeof createOrUpdateEmployeeLeaveBalanceSchema
>;
export type GetPresignedUrlInputForLeaveApplicationInput = z.infer<
  typeof getPresignedUrlInputForLeaveApplicationSchema
>;

export type UpdateLeaveTypeInput = z.infer<
  typeof updateLeaveTypeInputInputSchema
>;
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;
export type RejectLeaveRequestInput = z.infer<typeof rejectLeaveRequestSchema>;
export type ApproveLeaveRequestInput = z.infer<
  typeof approveLeaveRequestInputSchema
>;
export type LeavePolicyInput = z.infer<typeof leavePolicyInputSchema>;
export type CreatePublicHolidayInput = z.infer<
  typeof createPublicHolidaySchema
>;

export type UpdatePublicHolidayInput = z.infer<
  typeof updatePublicHolidaySchema
>;
