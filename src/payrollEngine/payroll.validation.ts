import { z } from "zod";
import { ExpressionTokenType } from "./payrollEngine.types.js";


const constantTokenSchema = z.object({
  type: z.literal(ExpressionTokenType.CONSTANT),
  value: z.number(),
});

const componentTokenSchema = z.object({
  type: z.literal(ExpressionTokenType.COMPONENT),
  componentId: z.string().uuid(),
});


export const expressionTokenSchema = z.object({
  type: z.enum(ExpressionTokenType),

  componentId: z.string().uuid().optional(),

  value: z.number().optional(),
});

export const expressionTokensSchema =
    z.array(expressionTokenSchema);