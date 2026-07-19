import type { Employee, PayrollComponent, Prisma } from "@prisma/client";
import type { PayrollComponentWithRule } from "./expressionEvaluator.js";

export interface EvaluationContext{
     employee: Employee;

    values: Map<string, Prisma.Decimal>;

    components: Map<string, PayrollComponent>;

    employeeCompensations: Map<string, Prisma.Decimal>;
}

export enum ExpressionTokenType {
  COMPONENT = "COMPONENT",
  CONSTANT = "CONSTANT",

  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  POWER = "POWER",
  MODULO = "MODULO",

  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",

  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",

  FUNCTION = "FUNCTION",

  COMMA = "COMMA"
}

export interface ExpressionToken {
  type: ExpressionTokenType;

  componentId?: string;

  value?: number;

  functionName?: string;
}

export interface EvaluationContext {
  values: Map<string, Prisma.Decimal>;
}


export const precedence: Record<ExpressionTokenType, number> = {
  ADD: 1,
  SUBTRACT: 1,

  MULTIPLY: 2,
  DIVIDE: 2,
  MODULO: 2,

  POWER: 3,

  GREATER_THAN: 0,
  GREATER_THAN_EQUAL: 0,
  LESS_THAN: 0,
  LESS_THAN_EQUAL: 0,
  EQUAL: 0,
  NOT_EQUAL: 0,

  COMPONENT: -1,
  CONSTANT: -1,
  FUNCTION: -1,

  LEFT_PAREN: -1,
  RIGHT_PAREN: -1,

  COMMA: -1
};

export type EvaluatedComponent  = {
    component : PayrollComponent , 
    amount : Prisma.Decimal
}
export interface PayrollContext {
    employeeId: string;

    companyId: string;

    payrollDate: Date;

    values: Map<string, EvaluatedComponent>;

    evaluating: Set<string>;
    components : Map<string  , PayrollComponentWithRule>
}

export type ExpressionValue =
    | Prisma.Decimal
    | boolean;


export interface IfExpression {

    type: "IF";

    condition: ExpressionToken[];

    trueExpression: PayrollExpression;

    falseExpression: PayrollExpression;
}

export type PayrollExpression =
{
    type: "ARITHMETIC";
    tokens: ExpressionToken[];
}
|
IfExpression



// {
//     type:"IF",

//     condition:[
//         Basic,
//         GREATER_THAN,
//         100000
//     ],

//     trueExpression:{
//         type:"ARITHMETIC",

//         tokens:[
//             Basic,
//             MULTIPLY,
//             0.5
//         ]
//     },

//     falseExpression:{
//         type:"ARITHMETIC",

//         tokens:[
//             Basic,
//             MULTIPLY,
//             0.3
//         ]
//     }
// }