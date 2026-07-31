import { Prisma } from "@prisma/client";
import {
  ExpressionTokenType,
  precedence,
  type EvaluatedComponent,
  type ExpressionToken,
  type ExpressionValue,
  type PayrollContext,
  type PayrollExpression,
} from "./payrollEngine.types.js";
import { prismaClient } from "../config/db.js";
import {
  BadRequestError,
  NotFoundError,
} from "../shared/exceptions/app.error.js";

export type PayrollComponentWithRule = Prisma.PayrollComponentGetPayload<{
  include: {
    rule: true;
  };
}>;
// Resolver definition

// resolver.ts

export type ComponentResolver = (
  componentId: string,
) => Promise<EvaluatedComponent>;
export class ExpressionEvaluator {
  static convert(tokens: ExpressionToken[]): ExpressionToken[] {
    const output: ExpressionToken[] = [];
    const operators: ExpressionToken[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case ExpressionTokenType.COMPONENT:
        case ExpressionTokenType.CONSTANT:
          output.push(token);
          break;

        case ExpressionTokenType.LEFT_PAREN:
          operators.push(token);
          break;

        case ExpressionTokenType.RIGHT_PAREN:
          while (
            operators.length &&
            operators[operators.length - 1]!.type !==
              ExpressionTokenType.LEFT_PAREN
          ) {
            output.push(operators.pop()!);
          }

          operators.pop();

          break;

        default:
          while (
            operators.length &&
            precedence[operators[operators.length - 1]!.type] >=
              precedence[token.type]
          ) {
            output.push(operators.pop()!);
          }

          operators.push(token);
      }
    }

    while (operators.length) {
      output.push(operators.pop()!);
    }

    console.log("the output is " , output);
    return output;
  }

  static async RPNEvaluator(
    tokens: ExpressionToken[],
    resolver: ComponentResolver,
  ): Promise<Prisma.Decimal | boolean> {
    const stack: ExpressionValue[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case ExpressionTokenType.CONSTANT:
          stack.push(new Prisma.Decimal(token.value!));

          break;

        case ExpressionTokenType.COMPONENT: {
          const value = await resolver(token.componentId!);

          if (!value) {
            throw new BadRequestError(
              `Component ${token.componentId} not found`,
            );
          }

          stack.push(value.amount);

          break;
        }

        default:
          await this.evaluateOperator(token.type, stack);
      }
    }

    if (stack.length !== 1) {
      throw new BadRequestError("Invalid expression");
    }

    
     console.log('the stack result is ' , stack[0]!);
    return stack[0]!;
  }

  private static async evaluateOperator(
    operator: ExpressionTokenType,
    stack: ExpressionValue[],
  ) {
    const right = stack.pop();

    const left = stack.pop();

    if (left === undefined || right === undefined) {
      throw new BadRequestError("Invalid expression");
    }

    switch (operator) {
      case ExpressionTokenType.ADD:
        stack.push((left as Prisma.Decimal).plus(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.SUBTRACT:
        stack.push((left as Prisma.Decimal).minus(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.MULTIPLY:
        stack.push((left as Prisma.Decimal).mul(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.DIVIDE:
        stack.push((left as Prisma.Decimal).div(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.GREATER_THAN:
        stack.push((left as Prisma.Decimal).gt(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.LESS_THAN:
        stack.push((left as Prisma.Decimal).lt(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.GREATER_THAN_EQUAL:
        stack.push((left as Prisma.Decimal).gte(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.LESS_THAN_EQUAL:
        stack.push((left as Prisma.Decimal).lte(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.EQUAL:
        stack.push((left as Prisma.Decimal).equals(right as Prisma.Decimal));

        break;

      case ExpressionTokenType.NOT_EQUAL:
        stack.push(!(left as Prisma.Decimal).equals(right as Prisma.Decimal));

        break;

      default:
        throw new BadRequestError(`Unsupported operator ${operator}`);
    }
  }

  static async evaluateExpression(
    expression: PayrollExpression,
    context: PayrollContext,
  ): Promise<Prisma.Decimal> {
    if (expression.type === "ARITHMETIC") {
      const rpn = this.convert(expression.tokens);

      const result = await this.RPNEvaluator(rpn, async (componentId) => {
        return this.componentEvaluator(componentId, context);
      });

      if (typeof result === "boolean") {
        throw new BadRequestError("Arithmetic expression returned boolean");
      }

      return result;
    }

    if (expression.type === "IF") {
      const conditionRPN = this.convert(expression.condition);

      const condition = await this.RPNEvaluator(
        conditionRPN,
        async (componentId) => {
          return this.componentEvaluator(componentId, context);
        },
      );

      if (typeof condition !== "boolean") {
        throw new BadRequestError("IF condition must return boolean");
      }

      if (condition) {
        return this.evaluateExpression(expression.trueExpression, context);
      }

      return this.evaluateExpression(expression.falseExpression, context);
    }

    throw new BadRequestError("Unknown expression type");
  }

  static async componentEvaluator(
    componentId: string,
    context: PayrollContext,
  ): Promise<EvaluatedComponent> {
    if (context.evaluating.has(componentId)) {
      throw new BadRequestError("Circular payroll dependency detected");
    }

    const cached = context.values.get(componentId);

    if (cached) {
      return cached;
    }

    context.evaluating.add(componentId);

    const component = context.components.get(componentId);

    if (!component) {
      throw new NotFoundError("Component not found");
    }

    let value: Prisma.Decimal;

    console.log("In the ocmpnent evaluator", component)

    switch (component.calculationType) {
      case "FIXED":
        value = new Prisma.Decimal(0);

        break;

      case "FORMULA":
        value = await this.evaluateFormulaComponent(component, context);

        break;

      default:
        throw new BadRequestError("Invalid calculation type");
    }

    const evaluated = {
      component,
      amount: value,
    };

    context.values.set(component.id, evaluated);

    context.evaluating.delete(componentId);

    return evaluated;
  }

  private static async evaluateFormulaComponent(
    component: PayrollComponentWithRule,
    context: PayrollContext,
  ): Promise<Prisma.Decimal> {
    console.log("the component is " , component)
    if (!component.rule) {
      throw new BadRequestError("No rule found");
    }

    const expression = component.rule
      .expression as unknown as PayrollExpression;

    return this.evaluateExpression(expression, context);
  }
}
