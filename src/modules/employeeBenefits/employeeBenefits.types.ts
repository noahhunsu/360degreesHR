import type { PayrollComponentType, Prisma } from "@prisma/client";

export type PayrollBreakdownResult = {
  payrollComponentId: string;
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