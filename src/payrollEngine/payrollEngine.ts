// runPayroll()
//     │
//     ├── Load payroll configuration
//     │
//     ├── Load employees
//     │
//     ├── Build dependency graph
//     │
//     ├── Validate graph (no circular references)
//     │
//     ├── Sort components
//     │
//     ├── For every employee
//     │       │
//     │       ├── Build evaluation context
//     │       │
//     │       ├── Evaluate every component
//     │       │
//     │       ├── Generate breakdown
//     │       │
//     │       └── Save PayrollItem
//     │
//     └── Finish PayrollRun

import type { Employee, Prisma } from "@prisma/client";
import { prismaClient } from "../config/db.js";
import { ExpressionEvaluator } from "./expressionEvaluator.js";
import type { EvaluatedComponent, PayrollContext } from "./payrollEngine.types.js";

export class PayrollEngine {
  static async runPayroll(companyId: string, month: number, year: number) {}

  private async loadEmployees(companyId: string) {
    const employees = await prismaClient.employee.findMany({
      where: {
        companyId,
      },
    });
    return employees;
  }
  private async loadComponent(companyId: string) {
    const payrollComponent = await prismaClient.payrollComponent.findMany({
      where: {
        companyId,
      },
      include: {
        rule: true,
      },
    });
    return payrollComponent;
  }
  private async buildDependencyGraph(companyId: string) {
    const payrollComponent = await prismaClient.payrollComponent.findMany({
      where: {
        companyId,
      },
      include: {
        rule: true,
      },
    });
    return payrollComponent;
  }

   static async evaluateEmployeePayroll(
    employee: Employee,
    payrollDate: Date,
    context: PayrollContext,
  ): Promise<Map<string, EvaluatedComponent>> {
    console.log("Employee from engine is " , employee)

    const compoent = await prismaClient.employeeCompensation.findMany({
      where  :{
        employee : {
          companyId : employee.companyId
        }
      }
    })
       console.log("the employee cocomponents " , compoent)
    const employeeCompensations =
      await prismaClient.employeeCompensation.findMany({
        where: {
          employeeId: employee.id,

          effectiveFrom: {
            lte: payrollDate,
          },

          OR: [
            {
              effectiveTo: null,
            },
            {
              effectiveTo: {
                gte: payrollDate,
              },
            },
          ],
        },

        include: {
          component: true,
        },
      });
      
      console.log("Employee compensations " , employeeCompensations)
      for (const compensation of employeeCompensations) {
        console.log("Employee compensations " , compensation)
        context.values.set(compensation.componentId, {component : compensation.component , amount : compensation.amount});
      }
      const calculatedComponents = await prismaClient.payrollComponent.findMany({
      where: {
        companyId: employee.companyId,
        
        calculationType: "FORMULA",
        
        isActive: true,
      },
    });
    
    console.log("Payroll compensations " , calculatedComponents)
    for (const calcComponent of calculatedComponents){
        await ExpressionEvaluator.componentEvaluator(
            calcComponent.id , context
        )
    }
    console.log("the context is " , context.values)
    return context.values
  }
}
