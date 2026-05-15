import * as z from "zod";
import { EmploymentType, Gender } from "../../../generated/prisma/enums.js";

export const createEmployeeSchema = z.object({


  firstName: z.string().min(2, "First name must be at least 2 characters"),

  password: z.string().min(8),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  email: z.email("Invalid email address"),

  phone: z
    .string()
    .regex(/^\+?[0-9]+$/, "Invalid phone number")
    .optional(),

  gender: z.enum(Gender),

  dateOfBirth: z.iso.datetime().optional(),

  address: z.string().max(255).optional(),

  jobTitle: z.string().max(100).optional(),

  employmentType: z.enum(EmploymentType).optional(),

  departmentId: z.uuid("Invalid department ID").optional(),

  managerId: z.uuid("Invalid manager ID").optional(),

  hireDate: z.iso.datetime().optional(),
});

export const filterQuery = z.object({
  name: z.string().optional(),

  limit: z.coerce.number().min(1).max(100).optional(),

  page: z.coerce.number().min(1).optional(),
});

export const updateEmployeeSchema = z.object({

  firstName: z
    .string()
    .min(2)
    .optional(),

  lastName: z
    .string()
    .min(2)
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE"])
    .optional(),

  dateOfBirth: z
    .iso
    .datetime()
    .optional(),

  address: z
    .string()
    .optional(),

  jobTitle: z
    .string()
    .optional(),

  employmentType: z
    .enum([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "INTERN",
      "REMOTE",
    ])
    .optional(),

  employmentStatus: z
    .enum([
      "ACTIVE",
      "INACTIVE",
      "SUSPENDED",
      "TERMINATED",
    ])
    .optional(),

  departmentId: z
    .uuid()
    .optional(),

  managerId: z
    .uuid()
    .optional(),

  /**
   * User fields
   */

  email: z
    .email()
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9]+$/)
    .optional(),

  role: z
    .enum([
      "HR_ADMIN",
      "MANAGER",
      "EMPLOYEE",
    ])
    .optional(),

  password: z
    .string()
    .min(8)
    .optional(),

});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type FilterQueryInput = z.infer<typeof filterQuery>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
