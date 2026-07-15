import {
  
  Prisma,

} from "@prisma/client";
import {
  ExpressionTokenType,
  precedence,
  type EvaluatedComponent,
  type ExpressionToken,
  type PayrollContext,
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

    return output;
  }

  static async RPNEvaluator(
    tokens: ExpressionToken[],
    resolver: ComponentResolver,
  ): Promise<Prisma.Decimal> {
    const stack: Prisma.Decimal[] = [];

    for (const token of tokens) {
      switch (token.type) {
        case ExpressionTokenType.CONSTANT:
          stack.push(new Prisma.Decimal(token.value!));
          break;

        case ExpressionTokenType.COMPONENT: {
          const value = await resolver(token.componentId!);

          if (!value) {
            throw new Error(
              `Component ${token.componentId} has not been evaluated`,
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

    return stack[0]!;
  }

  private static async evaluateOperator(
    operator: ExpressionTokenType,
    stack: Prisma.Decimal[],
  ) {
    const right = stack.pop();

    const left = stack.pop();

    if (!left || !right) {
      throw new BadRequestError("Invalid expression");
    }

    switch (operator) {
      case ExpressionTokenType.ADD:
        stack.push(left.plus(right));
        break;

      case ExpressionTokenType.SUBTRACT:
        stack.push(left.minus(right));
        break;

      case ExpressionTokenType.MULTIPLY:
        stack.push(left.mul(right));
        break;

      case ExpressionTokenType.DIVIDE:
        stack.push(left.div(right));
        break;

      default:
        throw new BadRequestError(`Unsupported operator ${operator}`);
    }
  }

  static async componentEvaluator(
    componentId: string,
    context: PayrollContext,
  ): Promise<EvaluatedComponent> {
    if (context.evaluating.has(componentId)) {
      throw new BadRequestError("Circular payroll dependency detected.");
    }
    const cached = context.values.get(componentId);

    if (cached) {
      return cached;
    }
    context.evaluating.add(componentId);
    const component = context.components.get(componentId)

    if (!component) {
      throw new NotFoundError("Component not found");
    }

    let value: Prisma.Decimal;
    switch (component.calculationType) {
      case "FIXED":
        value = new Prisma.Decimal(0);
        context.values.set(component.id, {component , amount : value});
        break;
      case "FORMULA":
        value = await this.evaluateFormulaComponent(component, context);
        break;
      default:
        throw new BadRequestError("Invalid calculation type");
    }
    context.values.set(component.id, {component , amount :value});
    context.evaluating.delete(componentId);
    return {component , amount : value};
  }
  private static async evaluateFormulaComponent(
    component: PayrollComponentWithRule,
    context: PayrollContext,
  ): Promise<Prisma.Decimal> {
    if (!component.rule) {
      throw new BadRequestError("No rule found in component");
    }
    const tokens = component.rule.expression as unknown as ExpressionToken[];
    // convert to rpn
    const rpnArray = this.convert(tokens);

    // Next , we evaluate
    return await this.RPNEvaluator(rpnArray, async (componentId: string) => {
      return this.componentEvaluator(componentId, context);
    });
  }
}
