import { Prisma, type Employee, type PrismaClient } from "@prisma/client";
import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";
import type {
  AddPayrollBreakdownInput,
  AttachEmployeeComponentInput,
  CreatePayrollComponentInput,
  EditPayrollSnapshotInput,
  RemoveEmployeeComponentInput,
  RemovePayrollBreakdownInput,
  RunPayrollInput,
  UpdateEmployeeComponentInput,
  UpdatePayrollComponentInput,
} from "./employeeBenefits.validation.js";
import type { PayslipDTO } from "./employeeBenefits.template.js";
import { assertHR, assertUser } from "../../utils/global.utils.js";
import { PayrollEngine } from "../../payrollEngine/payrollEngine.js";
import type { EvaluatedComponent } from "../../payrollEngine/payrollEngine.types.js";
import type {
  EmployeePayrollResult,
  PayrollBreakdownResult,
} from "./employeeBenefits.types.js";
import { LoansAndAdvanceService } from "../companyDebts/companyDebts.service.js";

export class PayrollComponentManagementService {
  static async createPayrollComponentService(
    user: User,
    payload: CreatePayrollComponentInput,
  ) {
    assertHR(user);
    console.log("The payload to create " , payload)

    const existingPayrollComponent =
      await prismaClient.payrollComponent.findFirst({
        where: {
          companyId: user.companyId,
          name: payload.name.toLowerCase(),
          isActive : true
        },
      });
    if (existingPayrollComponent) {
      throw new ConflictError("An existing");
    }

    const payrollTransaction = await prismaClient.$transaction(async (tx) => {
      const payrollComponent = await tx.payrollComponent.create({
        data: {
          companyId: user.companyId,
          name: payload.name,
          ...(payload.description && { description: payload.description }),
          componentType: payload.componentType,
          calculationType: payload.calculationType,
          ...(payload.calculationType === "FIXED" &&
            payload.fixedValue && {
              fixedValue: payload.fixedValue,
            }),
        },
      });
      console.log("The payload rule is " , payload.rule)
      if (payload.calculationType === "FORMULA" && payload.rule) {
        console.log("this branch was hit")
        const payrollRule = await tx.payrollRule.create({
          data: {
            companyId: user.companyId,
            name: payload.rule.ruleName,
            expression: payload.rule.expression,
          },
        });


        await tx.payrollComponent.update({
          where: {
            id: payrollComponent.id,
          },
          data: {
            ruleId: payrollRule.id,
          },
        });
      }
      console.log("The payrolee component" , payrollComponent)
      return payrollComponent;
    });
    return payrollTransaction;
  }
  static async updatePayrollComponentService(
    user: User,
    payrollComponentId: string,
    payload: UpdatePayrollComponentInput,
  ) {
    assertHR(user);

    const existingComponent = await prismaClient.payrollComponent.findFirst({
      where: {
        id: payrollComponentId,
        companyId: user.companyId,
      },
      include: {
        rule: true,
      },
    });

    if (!existingComponent) {
      throw new NotFoundError("Salary component not found");
    }

    return await prismaClient.$transaction(async (tx) => {
      let ruleId = existingComponent.ruleId;

      // ==========================================
      // Handle Formula Rule
      // ==========================================
      if (payload.calculationType === "FORMULA" && payload.rule) {
        if (existingComponent.rule) {
          await tx.payrollRule.update({
            where: {
              id: existingComponent.rule.id,
            },
            data: {
              name: payload.rule.ruleName,
              expression: payload.rule.expression,
            },
          });

          ruleId = existingComponent.rule.id;
        } else {
          const createdRule = await tx.payrollRule.create({
            data: {
              companyId: user.companyId,
              name: payload.rule.ruleName,
              expression: payload.rule.expression,
            },
          });

          ruleId = createdRule.id;
        }
      }

      // ==========================================
      // Switching back to Fixed
      // ==========================================
      if (payload.calculationType === "FIXED") {
        if (existingComponent.ruleId) {
          await tx.payrollRule.delete({
            where: {
              id: existingComponent.ruleId,
            },
          });
        }

        ruleId = null;
      }

      // ==========================================
      // Build update object dynamically
      // ==========================================
      const updateData: Prisma.PayrollComponentUpdateInput = {};

      if (payload.name !== undefined) {
        updateData.name = payload.name;
      }

      if (payload.description !== undefined) {
        updateData.description = payload.description;
      }

      if (payload.componentType !== undefined) {
        updateData.componentType = payload.componentType;
      }

      if (payload.calculationType !== undefined) {
        updateData.calculationType = payload.calculationType;
      }

      if (payload.calculationType === "FIXED") {
        updateData.fixedValue =
          payload.fixedValue != null
            ? new Prisma.Decimal(payload.fixedValue)
            : null;
      } else {
        updateData.fixedValue = null;
      }

      updateData.rule =
        ruleId === null
          ? {
              disconnect: true,
            }
          : {
              connect: {
                id: ruleId,
              },
            };

      const updatedComponent = await tx.payrollComponent.update({
        where: {
          id: payrollComponentId,
        },
        data: updateData,
        include: {
          rule: true,
        },
      });

      return updatedComponent;
    });
  }
  static async deletePayrollComponentServiceService(
    user: User,
    payrollComponentId: string,
  ) {
    assertHR(user);

    const existingPayrollComponent =
      await prismaClient.payrollComponent.findFirst({
        where: {
          id: payrollComponentId,
          companyId: user.companyId,
        },
      });
    if (!existingPayrollComponent) {
      throw new NotFoundError("Payroll component not found");
    }

    await prismaClient.payrollComponent.update({
      where: {
        id: existingPayrollComponent.id,
      },
      data: {
        isActive: false,
      },
    });
    return {
      message: "Payroll component deleted successfully",
    };
  }

  static async getSinglePayrollComponentService(
    user: User,
    payrollComponentId: string,
  ) {
    assertUser(user);

    const payrollComponent = await prismaClient.payrollComponent.findFirst({
      where: {
        id: payrollComponentId,
        companyId: user.companyId,
        isActive: true,
      },
      include: {
        rule: true,
      },
    });

    if (!payrollComponent) {
      throw new NotFoundError("payroll component not found");
    }

    return payrollComponent;
  }
  static async getAllPayrollComponentsService(
    user: User,
    page = 1,
    limit = 10,
    search?: string,
  ) {
    assertUser(user);

    const skip = (page - 1) * limit;

    const where: Prisma.PayrollComponentWhereInput = {
      companyId: user.companyId,
      isActive: true,

      ...(search && {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    const [components, total] = await prismaClient.$transaction([
      prismaClient.payrollComponent.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prismaClient.payrollComponent.count({
        where,
      }),
    ]);

    return {
      data: components,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async runPayrollForMonthService(user: User, payload: RunPayrollInput) {
    assertHR(user);
    const payrollRunCheck = await prismaClient.payrollRun.findFirst({
      where: {
        month: payload.month,
        year: payload.year,
        companyId: user.companyId,
      },
    });

    if (payrollRunCheck) {
      throw new BadRequestError("Payroll for selected period already run");
    }
    const payrollDate = new Date();

    const payrollComponent = await prismaClient.payrollComponent.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        rule: true,
      },
    });

    const employees = await prismaClient.employee.findMany({
      where: {
        companyId: user.companyId,
        employmentStatus: "ACTIVE",
      },
    });
    const transaction = await prismaClient.$transaction(async (tx) => {
      const payrollRun = await tx.payrollRun.create({
        data: {
          companyId: user.companyId,
          month: payload.month,
          year: payload.year,
          generatedById: user.userId,
        },
      });
      for (const employee of employees) {

        console.log("The employee currently being run"  ,employee)
        const context = {
          employeeId: employee.id,
          companyId: user.companyId,
          payrollDate,
          values: new Map(),
          evaluating: new Set<string>(),
          components: new Map(payrollComponent.map((comp) => [comp.id, comp])),
        };

        const evaluatedComponents = await PayrollEngine.evaluateEmployeePayroll(
          employee,
          payrollDate,
          context,
        );
        const payrollResult = this.buildPayrollResult(evaluatedComponents);

        const adjustedPayroll = await this.applyPayrollAdjustments(
          // tx,
          employee,
          payrollResult,
        );
        await this.saveEmployee(tx, payrollRun.id, employee, adjustedPayroll);
      }
    });

    return transaction;
  }
  static async getEmployeeComponentService(user: User, employeeId: string) {
    assertHR(user);
    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },
    });
    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }
    const employeeCompensation =
      await prismaClient.employeeCompensation.findMany({
        where: {
          employeeId,
          effectiveTo: null,
        },
      });

    if (!employeeCompensation) {
      return [];
    }
    return employeeCompensation;
  }

  static async attachComponentService(
    user: User,
    employeeId: string,
    payload: AttachEmployeeComponentInput,
  ) {
    assertHR(user);

    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found.");
    }

    
    const componentIds = payload.components.map(
      (component) => component.componentId,
    );

    const uniqueComponentIds = [...new Set(componentIds)];

    if (uniqueComponentIds.length !== componentIds.length) {
      throw new BadRequestError("Duplicate payroll components supplied.");
    }

    const employeePayrollComponents =
      await prismaClient.payrollComponent.findMany({
        where: {
          companyId: user.companyId,
          id: {
            in: uniqueComponentIds,
          },
        },
      });

    if (employeePayrollComponents.length !== uniqueComponentIds.length) {
      throw new NotFoundError("One or more salary components do not exist.");
    }

    const existingComponents = await prismaClient.employeeCompensation.findMany(
      {
        where: {
          employeeId,
          componentId: {
            in: uniqueComponentIds,
          },
          effectiveTo: null,
        },
      },
    );

    if (existingComponents.length > 0) {
      throw new ConflictError(
        "One or more salary components are already attached to this employee.",
      );
    }

    const compensation = await prismaClient.employeeCompensation.createMany({
      data: payload.components.map((component) => ({
        employeeId,
        componentId: component.componentId,
        amount: component.amount,
        effectiveFrom: component.effectiveFrom,
        effectiveTo: component.effectiveTo ?? null,
      })),
    });

    return {
      compensation ,
      message: "Payroll components attached successfully.",
    };
  }

  static async updateEmployeeComponentsService(
    user: User,
    employeeId: string,
    payload: UpdateEmployeeComponentInput,
  ) {
    assertHR(user);

    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found.");
    }

    // Prevent duplicate component IDs in request
    const componentIds = payload.components.map(
      (component) => component.componentId,
    );

    const uniqueComponentIds = [...new Set(componentIds)];

    if (componentIds.length !== uniqueComponentIds.length) {
      throw new BadRequestError("Duplicate payroll components supplied.");
    }

    // Validate all payroll components belong to the company
    const payrollComponents = await prismaClient.payrollComponent.findMany({
      where: {
        companyId: user.companyId,
        id: {
          in: uniqueComponentIds,
        },
      },
    });

    if (payrollComponents.length !== uniqueComponentIds.length) {
      throw new NotFoundError("One or more payroll components do not exist.");
    }

    // Fetch every ACTIVE compensation currently attached
    const existingCompensations =
      await prismaClient.employeeCompensation.findMany({
        where: {
          employeeId,
          componentId: {
            in: uniqueComponentIds,
          },
          effectiveTo: null,
        },
      });

    await prismaClient.$transaction(
      payload.components.flatMap((component) => {
        const existing = existingCompensations.find(
          (item) => item.componentId === component.componentId,
        );

        /**
         * CASE 1
         * Component already exists.
         *
         * Close the previous record and create a new version.
         */
        if (existing) {
          const previousDay = new Date(component.effectiveFrom);
          previousDay.setDate(previousDay.getDate() - 1);

          return [
            prismaClient.employeeCompensation.update({
              where: {
                id: existing.id,
              },
              data: {
                effectiveTo: previousDay,
              },
            }),

            prismaClient.employeeCompensation.create({
              data: {
                employeeId,
                componentId: component.componentId,
                amount: component.amount,
                effectiveFrom: component.effectiveFrom,
                effectiveTo: null,
              },
            }),
          ];
        }

        /**
         * CASE 2
         * Brand-new component.
         *
         * Simply create it.
         */
        return [
          prismaClient.employeeCompensation.create({
            data: {
              employeeId,
              componentId: component.componentId,
              amount: component.amount,
              effectiveFrom: component.effectiveFrom,
              effectiveTo: null,
            },
          }),
        ];
      }),
    );

    return {
      message: "Employee salary components updated successfully.",
    };
  }

  static async removeEmployeeComponentsService(
    user: User,
    employeeId: string,
    payload: RemoveEmployeeComponentInput,
  ) {
    assertHR(user);

    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found.");
    }

    // Prevent duplicate component IDs
    const componentIds = payload.components.map(
      (component) => component.componentId,
    );

    const uniqueComponentIds = [...new Set(componentIds)];

    if (componentIds.length !== uniqueComponentIds.length) {
      throw new BadRequestError("Duplicate payroll components supplied.");
    }

    // Ensure the payroll components belong to the company
    const payrollComponents = await prismaClient.payrollComponent.findMany({
      where: {
        companyId: user.companyId,
        id: {
          in: uniqueComponentIds,
        },
      },
    });

    if (payrollComponents.length !== uniqueComponentIds.length) {
      throw new NotFoundError("One or more payroll components do not exist.");
    }

    // Fetch active compensations
    const existingCompensations =
      await prismaClient.employeeCompensation.findMany({
        where: {
          employeeId,
          componentId: {
            in: uniqueComponentIds,
          },
          effectiveTo: null,
        },
      });

    if (existingCompensations.length !== uniqueComponentIds.length) {
      const attachedIds = existingCompensations.map((item) => item.componentId);

      const missingIds = uniqueComponentIds.filter(
        (id) => !attachedIds.includes(id),
      );

      const missingComponents = payrollComponents
        .filter((component) => missingIds.includes(component.id))
        .map((component) => component.name);

      throw new ConflictError(
        `The following salary components are not attached to this employee: ${missingComponents.join(
          ", ",
        )}.`,
      );
    }

    await prismaClient.$transaction(
      payload.components.map((component) => {
        const existing = existingCompensations.find(
          (item) => item.componentId === component.componentId,
        )!;

        const effectiveTo = new Date(component.effectiveFrom);
        effectiveTo.setDate(effectiveTo.getDate() - 1);
        return prismaClient.employeeCompensation.update({
          where: {
            id: existing.id,
          },
          data: {
            effectiveTo,
          },
        });
      }),
    );

    return {
      message: "Employee salary components removed successfully.",
    };
  }

  static async lockPayrollService(user: User, payrollId: string) {
    assertHR(user);
    const payroll = await prismaClient.payrollRun.findFirst({
      where: {
        companyId: user.companyId,
        id: payrollId,
        status: "DRAFT",
      },
    });

    if (!payroll) {
      throw new NotFoundError("Payroll not found");
    }

    return prismaClient.payrollRun.update({
      where: {
        id: payroll.id,
      },
      data: {
        status: "LOCKED",
      },
    });
  }
  static async markPayrollAsPaidService(user: User, payrollId: string) {
    assertHR(user);

    const payroll = await prismaClient.payrollRun.findFirst({
      where: {
        companyId: user.companyId,
        id: payrollId,
        status: "DRAFT",
      },
    });

    if (!payroll) {
      throw new NotFoundError("Payroll not found");
    }

    return prismaClient.payrollRun.update({
      where: {
        id: payroll.id,
      },
      data: {
        status: "PAID",
      },
    });
  }

  static async editPayrollSnapshotService(
    user: User,
    breakdownId: string,
    payload: EditPayrollSnapshotInput,
  ) {
    assertHR(user);

    // get the breakdown id
    const breakdown = await prismaClient.payrollBreakdown.findFirst({
      where: {
        id: breakdownId,
      },
      include: {
        payrollItem: {
          include: {
            payrollRun: true,
          },
        },
        component: true,
      },
    });
    if (!breakdown) {
      throw new NotFoundError("Breakdown does not exist");
    }

    if (breakdown.payrollItem.payrollRun.status !== "DRAFT") {
      throw new BadRequestError("Only drafts can be updated");
    }
    let totalEarnings = breakdown.payrollItem.totalEarnings;
    let totalDeductions = breakdown.payrollItem.totalDeductions;

    if (breakdown.component.componentType === "EARNING") {
      totalEarnings = totalEarnings.minus(breakdown.amount);
      totalEarnings = totalEarnings.plus(payload.amount);
    }
    if (breakdown.component.componentType === "DEDUCTION") {
      totalDeductions = totalDeductions.minus(breakdown.amount);
      totalDeductions = totalDeductions.plus(payload.amount);
    }

    const netPay = totalEarnings.minus(totalDeductions);
    const updates = await prismaClient.$transaction(async (tx) => {
      await tx.payrollBreakdown.update({
        where: {
          id: breakdown.id,
        },
        data: {
          amount: payload.amount,
        },
      });

      const payrollItem = await tx.payrollItem.update({
        where: {
          id: breakdown.payrollItemId,
        },
        data: {
          grossPay: totalEarnings,
          totalEarnings,
          totalDeductions,
          netPay,
        },
      });
      return payrollItem;
    });

    return updates;
  }

  // static async addPayrollBreakdownService(
  //   user: User,
  //   payrollItemId: string,
  //   payload: AddPayrollBreakdownInput,
  // ) {
  //   if (!user) {
  //     throw new UnauthorizedError("You must be authorized");
  //   }

  //   if (user.role !== "HR_ADMIN") {
  //     throw new UnauthorizedError(
  //       "You are not authorized to perform this action",
  //     );
  //   }

  //   const payrollItem = await prismaClient.payrollItem.findFirst({
  //     where: {
  //       id: payrollItemId,
  //     },
  //     include: {
  //       payrollRun: true,
  //     },
  //   });

  //   if (!payrollItem) {
  //     throw new NotFoundError("Payroll item not found");
  //   }

  //   if (payrollItem.payrollRun.companyId !== user.companyId) {
  //     throw new UnauthorizedError(
  //       "You are not authorized to modify this payroll.",
  //     );
  //   }

  //   if (payrollItem.payrollRun.status !== "DRAFT") {
  //     throw new BadRequestError("Only draft payrolls can be modified.");
  //   }

  //   const updatedPayrollItem = await prismaClient.$transaction(async (tx) => {
  //     let totalEarnings = new Prisma.Decimal(payrollItem.totalEarnings);

  //     let totalDeductions = new Prisma.Decimal(payrollItem.totalDeductions);

  //     for (const breakdown of payload.breakdowns) {
  //       await tx.payrollBreakdown.create({
  //         data: {
  //           payrollItemId: payrollItem.id,
  //           componentName: breakdown.name,
  //           amount: breakdown.amount,
  //           type: breakdown.type,

  //         },
  //       });

  //       if (breakdown.type === "EARNING") {
  //         totalEarnings = totalEarnings.plus(breakdown.amount);
  //       } else {
  //         totalDeductions = totalDeductions.plus(breakdown.amount);
  //       }
  //     }

  //     const grossPay = totalEarnings;
  //     const netPay = grossPay.minus(totalDeductions);

  //     return await tx.payrollItem.update({
  //       where: {
  //         id: payrollItem.id,
  //       },
  //       data: {
  //         grossPay,
  //         totalEarnings,
  //         totalDeductions,
  //         netPay,
  //       },
  //     });
  //   });

  //   return updatedPayrollItem;
  // }

  static async removePayrollBreakdownService(
    user: User,
    payrollItemId: string,
    payload: RemovePayrollBreakdownInput,
  ) {
    assertHR(user);

    const payrollItem = await prismaClient.payrollItem.findFirst({
      where: {
        id: payrollItemId,
      },
      include: {
        payrollRun: true,
      },
    });

    if (!payrollItem) {
      throw new NotFoundError("Payroll item not found");
    }

    if (payrollItem.payrollRun.companyId !== user.companyId) {
      throw new UnauthorizedError(
        "You are not authorized to modify this payroll.",
      );
    }

    if (payrollItem.payrollRun.status !== "DRAFT") {
      throw new BadRequestError("Only draft payrolls can be modified.");
    }

    const breakdownIds = payload.breakdowns.map((b: any) => b.breakdownId);

    const payrollBreakdowns = await prismaClient.payrollBreakdown.findMany({
      where: {
        id: {
          in: breakdownIds,
        },
        payrollItemId,
      },
      include: {
        component: true,
      },
    });

    if (payrollBreakdowns.length !== breakdownIds.length) {
      throw new NotFoundError("One or more payroll breakdowns were not found.");
    }

    const updatedPayrollItem = await prismaClient.$transaction(async (tx) => {
      let totalEarnings = new Prisma.Decimal(payrollItem.totalEarnings);

      let totalDeductions = new Prisma.Decimal(payrollItem.totalDeductions);

      for (const breakdown of payrollBreakdowns) {
        if (breakdown.component.componentType === "EARNING") {
          totalEarnings = totalEarnings.minus(breakdown.amount);
        } else {
          totalDeductions = totalDeductions.minus(breakdown.amount);
        }

        await tx.payrollBreakdown.delete({
          where: {
            id: breakdown.id,
          },
        });
      }

      const grossPay = totalEarnings;
      const netPay = grossPay.minus(totalDeductions);

      return await tx.payrollItem.update({
        where: {
          id: payrollItem.id,
        },
        data: {
          grossPay,
          totalEarnings,
          totalDeductions,
          netPay,
        },
      });
    });

    return updatedPayrollItem;
  }

  static async validatePayrollNotAlreadyGenerated(
    companyId: string,
    month: number,
    year: number,
  ) {
    const payroll = await prismaClient.payrollRun.findFirst({
      where: {
        companyId,
        month,
        year,
        status: {
          not: "DRAFT",
        },
      },
    });

    if (payroll) {
      throw new ConflictError("A payroll run already exists");
    }
  }

  static async getEligibleEmployees(companyId: string) {
    const employees = await prismaClient.employee.findMany({
      where: {
        companyId,
        employmentStatus: "ACTIVE",
        deletedAt: null,
      },
    });

    return employees;
  }
  static async getAllPayrollRunsService(user: User) {
    assertHR(user);

    const payrollRuns = await prismaClient.payrollRun.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        payrollItems: {
          include: {
            breakdown: true,
          },
        },
      },
    });
    return payrollRuns;
  }
  static async getSinglePayrollRunsService(user: User, payrollId: string) {
    assertHR(user);

    const payrollRun = await prismaClient.payrollRun.findFirst({
      where: {
        companyId: user.companyId,
        id: payrollId,
      },
      include: {
        payrollItems: {
          include: {
            breakdown: true,
          },
        },
      },
    });
    return payrollRun;
  }

  static async getAllEmployeePayrollItemService(
    user: User,
    employeeId: string,
  ) {
    assertHR(user);
    const employee = await prismaClient.employee.findFirst({
      where: {
        companyId: user.companyId,
        id: employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundError("No employee with ID found");
    }
    const payrollItem = await prismaClient.payrollItem.findFirst({
      where: {
        employeeId: employee.id,
      },
      include: {
        breakdown: true,
      },
    });
    return payrollItem;
  }

  static async getSingleEmployeePayrollItemService(
    user: User,
    employeeId: string,
    payrollItemId: string,
  ) {
    assertHR(user);
    const employee = await prismaClient.employee.findFirst({
      where: {
        companyId: user.companyId,
        id: employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundError("No employee with ID found");
    }
    const payrollItem = await prismaClient.payrollItem.findFirst({
      where: {
        employeeId: employee.id,
        id: payrollItemId,
      },
      include: {
        breakdown: true,
      },
    });
    return payrollItem;
  }

  static async getPayrollSummaryService(user: User, payrollRunId: string) {
    assertHR(user);

    const payrollRun = await prismaClient.payrollRun.findFirst({
      where: {
        id: payrollRunId,
        companyId: user.companyId,
      },
      include: {
        generatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payrollItems: {
          select: {
            totalEarnings: true,
            totalDeductions: true,
            netPay: true,
          },
        },
      },
    });

    if (!payrollRun) {
      throw new NotFoundError("Payroll run not found");
    }

    let totalEarnings = new Prisma.Decimal(0);
    let totalDeductions = new Prisma.Decimal(0);
    let totalNetPay = new Prisma.Decimal(0);

    for (const item of payrollRun.payrollItems) {
      totalEarnings = totalEarnings.plus(item.totalEarnings);
      totalDeductions = totalDeductions.plus(item.totalDeductions);
      totalNetPay = totalNetPay.plus(item.netPay);
    }

    return {
      id: payrollRun.id,
      month: payrollRun.month,
      year: payrollRun.year,
      status: payrollRun.status,

      employeeCount: payrollRun.payrollItems.length,

      totalEarnings,
      totalDeductions,
      totalNetPay,

      generatedBy: payrollRun.generatedBy,
      generatedAt: payrollRun.generatedAt,
      lockedAt: payrollRun.lockedAt,
      paidAt: payrollRun.paidAt,
      notes: payrollRun.notes,
    };
  }

  static async deletePayrollRunService(user: User, payrollRunId: string) {
    assertHR(user);

    const payrollRun = await prismaClient.payrollRun.findFirst({
      where: {
        id: payrollRunId,
        companyId: user.companyId,
      },
    });

    if (!payrollRun) {
      throw new NotFoundError("Payroll run not found");
    }

    if (payrollRun.status !== "DRAFT") {
      throw new BadRequestError("Only draft payroll runs can be deleted.");
    }

    // Delete payroll run
    await prismaClient.payrollRun.delete({
      where: {
        id: payrollRunId,
      },
    });

    return {
      message: "Payroll run deleted successfully.",
    };
  }

  static async getEmployeePayrollHistoryService(
    user: User,
    employeeId: string,
  ) {
    assertHR(user);

    if (user.role !== "HR_ADMIN") {
    }
    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    const payrollHistory = await prismaClient.payrollItem.findMany({
      where: {
        employeeId,
        payrollRun: {
          companyId: user.companyId,
        },
      },
      include: {
        payrollRun: {
          select: {
            id: true,
            month: true,
            year: true,
            status: true,
            generatedAt: true,
            paidAt: true,
          },
        },
      },
      orderBy: [
        {
          payrollRun: {
            year: "desc",
          },
        },
        {
          payrollRun: {
            month: "desc",
          },
        },
      ],
    });

    return payrollHistory;
  }

  static async getMyPayslipService(user: User, payrollRunId: string) {
    assertUser(user);

    const employee = await prismaClient.employee.findFirst({
      where: {
        userId: user.userId,
        companyId: user.companyId,
      },
      include: {
        department: true,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    const payrollItem = await prismaClient.payrollItem.findFirst({
      where: {
        employeeId: employee.id,
        payrollRunId,
        payrollRun: {
          companyId: user.companyId,
        },
      },
      include: {
        payrollRun: {
          include: {
            company: true,
          },
        },
        breakdown: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!payrollItem) {
      throw new NotFoundError("Payslip not found");
    }

    if (payrollItem.payrollRun.status === "DRAFT") {
      throw new BadRequestError(
        "Payslips cannot be viewed until payroll has been finalized.",
      );
    }

    const earnings = payrollItem.breakdown
      .filter((item) => item.component.componentType === "EARNING")
      .map((item) => ({
        name: item.componentName,
        amount: Number(item.amount),
      }));

    const deductions = payrollItem.breakdown
      .filter((item) => item.component.componentType === "DEDUCTION")
      .map((item) => ({
        name: item.componentName,
        amount: Number(item.amount),
      }));

    const dto: PayslipDTO = {
      company: {
        name: payrollItem.payrollRun.company.name,
      },

      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        department: employee.department,
      },

      payroll: {
        month: payrollItem.payrollRun.month,
        year: payrollItem.payrollRun.year,
        generatedAt: payrollItem.payrollRun.generatedAt,
        paidAt: payrollItem.payrollRun.paidAt,
      },

      earnings,

      deductions,

      totals: {
        grossPay: Number(payrollItem.grossPay),
        totalEarnings: Number(payrollItem.totalEarnings),
        totalDeductions: Number(payrollItem.totalDeductions),
        netPay: Number(payrollItem.netPay),
      },
    };

    return dto;
  }

  // Helper functions

  private static buildPayrollResult(
    evaluatedComponents: Map<string, EvaluatedComponent>,
  ): EmployeePayrollResult {
    const breakdowns: PayrollBreakdownResult[] = [];
    const a = evaluatedComponents.values;
    let totalEarnings = new Prisma.Decimal(0);
    let totalDeductions = new Prisma.Decimal(0);

    for (const { component, amount } of evaluatedComponents.values()) {
      breakdowns.push({
        payrollComponentId: component.id,
        name: component.name,
        componentType: component.componentType,
        amount,
      });
      switch (component.componentType) {
        case "EARNING":
          totalEarnings = totalEarnings.plus(amount);
          break;

        case "DEDUCTION":
          totalDeductions = totalDeductions.plus(amount);
          break;

        default:
          break;
      }
    }

    const grossPay = totalEarnings;
    const netPay = grossPay.minus(totalDeductions);
    return {
      grossPay,
      totalEarnings,
      totalDeductions,
      netPay,

      breakdowns,
    };
  }

  private static async applyPayrollAdjustments(
    // tx: Prisma.TransactionClient,
    employee: Employee,
    payrollResult: EmployeePayrollResult,
  ): Promise<EmployeePayrollResult> {
    const salaryAdvance =
      await LoansAndAdvanceService.getEmployeeSalaryAdvanceForPayrollService(
        employee.id,
      );

    if (!salaryAdvance || salaryAdvance === undefined) {
      return payrollResult;
    }

    payrollResult.totalDeductions = payrollResult.totalDeductions.plus(
      salaryAdvance.approvedAmount!,
    );

    payrollResult.netPay = payrollResult.grossPay.minus(
      payrollResult.totalDeductions,
    );

    payrollResult.breakdowns.push({
      payrollComponentId: "null",
      name: "Salary Advance",
      componentType: "DEDUCTION",
      amount: salaryAdvance.approvedAmount!,
    });

    return payrollResult;
  }
  private static async buildPayrollItem() {}

  private static async saveEmployee(
    tx: Prisma.TransactionClient,
    payrollRunId: string,
    employee: Employee,
    payrollResult: EmployeePayrollResult,
  ) {
    const payrollItem = await tx.payrollItem.create({
      data: {
        payrollRunId,
        employeeId: employee.id,
        grossPay: payrollResult.grossPay,
        totalDeductions: payrollResult.totalDeductions,
        totalEarnings: payrollResult.totalEarnings,
        netPay: payrollResult.netPay,
      },
    });

    console.log("The breakdown is ", payrollResult.breakdowns)
    await tx.payrollBreakdown.createMany({
      data: payrollResult.breakdowns.map((breakdown) => ({
        payrollItemId: payrollItem.id,
        componentId: breakdown.payrollComponentId,
        amount: breakdown.amount,
        componentName: breakdown.name,
        type: breakdown.componentType,
      })),
    });
  }
}
