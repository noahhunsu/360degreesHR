import type { PayrollComponentType, Prisma } from "@prisma/client";
import type { ExpressionToken } from "../../payrollEngine/payrollEngine.types.js";

export type PayrollBreakdownResult = {
  payrollComponentId: string | null;
  name: string;
  componentType: PayrollComponentType;
  amount: Prisma.Decimal;
};

export type EmployeePayrollResult = {
  grossPay: Prisma.Decimal;
  totalEarnings: Prisma.Decimal;
  totalDeductions: Prisma.Decimal;
  netPay: Prisma.Decimal;

  breakdowns: PayrollBreakdownResult[];
};

export interface ArithmeticExpression {
    type: "ARITHMETIC";
    tokens: ExpressionToken[];
}

export interface IfExpression {
    type: "IF";

    condition: ExpressionToken[];

    trueExpression: PayrollExpression;

    falseExpression: PayrollExpression;
}

export type PayrollExpression =
    | ArithmeticExpression
    | IfExpression;