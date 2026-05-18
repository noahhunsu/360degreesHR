import { DisciplinarySeverity, DisciplinaryType } from "@prisma/client";
import { z } from "zod";
// import { DisciplinarySeverity, DisciplinaryType } from "../../../generated/prisma/enums.js";


export const createDisciplinarySchema = z.object({
  type: z.enum(DisciplinaryType),

  severity: z.enum(DisciplinarySeverity),

  title: z
    .string()
    .min(3, "Title is required"),

  description: z
    .string()
    .min(10, "Description is too short"),
});


export const resolveDisciplinarySchema = z.object({
  resolutionNotes: z
    .string()
    .min(5, "Resolution notes are required"),
});
export type CreateDisciplinaryInput =
  z.infer<typeof createDisciplinarySchema>;
export type ResolveDisciplinaryInput =
  z.infer<typeof resolveDisciplinarySchema>;