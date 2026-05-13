import * as z from "zod";
import { DepartmentStatus, EmploymentType, Gender } from "../../../generated/prisma/enums.js";

export const createDepartmentSchema = z.object({
  name: z.string().min(3),
  description : z.string(),
  parentDepartmentId: z.string().optional(),
  headEmployeeId: z.string().optional,
});
export const updateDepartmentSchema = z.object({
  name: z.string().min(3).optional(),

  description: z.string().optional(),

  parentDepartmentId: z.uuid().optional(),

  headEmployeeId: z.uuid().optional(),
  status: z.enum(DepartmentStatus).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
