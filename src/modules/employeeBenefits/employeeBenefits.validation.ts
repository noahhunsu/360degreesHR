import { ComponentCalculationType, PayrollComponentType, PayrollOperation } from "@prisma/client";
import z from "zod";


export const expressionTokenSchema = z.object({
  type: z.string(),
  value: z.string().optional(),
});

export const arithmeticExpressionSchema = z.object({
  type: z.literal("ARITHMETIC"),
  tokens: z.array(expressionTokenSchema),
});

// Define the recursive schema directly
export const payrollExpressionSchema: z.ZodType<
  | { type: "ARITHMETIC"; tokens: z.infer<typeof expressionTokenSchema>[] }
  | { type: "IF"; condition: z.infer<typeof expressionTokenSchema>[]; trueExpression: any; falseExpression: any }
> = z.lazy(() =>
  z.discriminatedUnion("type", [
    arithmeticExpressionSchema,
    z.object({
      type: z.literal("IF"),
      condition: z.array(expressionTokenSchema),
      trueExpression: payrollExpressionSchema,
      falseExpression: payrollExpressionSchema,
    }),
  ])
);

// Then use it in your main schema
export const formulaExpressionSchema = z.object({
  type: z.string(),
  componentId: z.string().optional(),
});

export const createPayrollComponentSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  componentType: z.enum(PayrollComponentType),
  calculationType: z.enum(ComponentCalculationType),
  fixedValue: z.coerce.number().optional(),
  rule: z.object({
    ruleName: z.string(),
    ruleDescription: z.string().optional(),
    expression: payrollExpressionSchema,
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.calculationType === "FIXED" && data.fixedValue === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fixedValue"],
      message: "Fixed value is required for FIXED components.",
    });
  }

  if (data.calculationType === "FORMULA") {
    if (!data.rule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rule"],
        message: "Rule is required for FORMULA components.",
      });
      return;
    }

    if (!data.rule.ruleName || data.rule.ruleName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rule", "ruleName"],
        message: "Rule name is required.",
      });
    }

    if (!data.rule.expression) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rule", "expression"],
        message: "Expression is required.",
      });
    }
  }
});

export const updatePayrollComponentSchema = createPayrollComponentSchema;


export const attachEmployeeComponentSchema = z.object({
  components: z
    .array(
      z.object({
        componentId: z.string().uuid(),
        amount: z.coerce.number().positive(),
        effectiveFrom: z.coerce.date(),
        effectiveTo: z.coerce.date().optional(),
      }),
    )
    .min(1, "At least one salary component is required"),
});



export const updateEmployeeComponentSchema = z.object({
  components: z
    .array(
      z.object({
        componentId: z.string().uuid(),
        amount: z.coerce.number().positive(),
        effectiveFrom: z.coerce.date(),
      }),
    )
    .min(1, "At least one salary component is required"),
});
export const removeEmployeeComponentSchema = z.object({
  components: z
    .array(
      z.object({
        componentId: z.string().uuid(),
        effectiveFrom: z.coerce.date(),
      }),
    )
    .min(1, "At least one salary component is required"),
});

export const runPayrollSchema = z.object({
  month : z.coerce.number(),
  year : z.number().int().min(2000).max(2100)
})
export const editPayrollSnapshotSchema = z.object({
  amount : z.coerce.number()
})

export const addPayrollBreakdownSchema = z.object({
  breakdowns : z.array(z.object({
    name : z.string(),
    type : z.enum(PayrollComponentType),
    amount : z.coerce.number()
  }))
})
export const removePayrollBreakdownSchema = z.object({
  breakdowns : z.array(z.object({
    breakdownId : z.string()
  }))
})



export type CreatePayrollComponentInput = z.infer<typeof createPayrollComponentSchema>;
export type AttachEmployeeComponentInput = z.infer<typeof attachEmployeeComponentSchema>;
export type UpdatePayrollComponentInput = z.infer<typeof updatePayrollComponentSchema>;
export type UpdateEmployeeComponentInput = z.infer<typeof updateEmployeeComponentSchema >;
export type RemoveEmployeeComponentInput = z.infer<typeof removeEmployeeComponentSchema >;
export type RunPayrollInput = z.infer<typeof runPayrollSchema >;
export type EditPayrollSnapshotInput = z.infer<typeof editPayrollSnapshotSchema >;
export type AddPayrollBreakdownInput = z.infer<typeof addPayrollBreakdownSchema >;
export type RemovePayrollBreakdownInput = z.infer<typeof removePayrollBreakdownSchema >;


