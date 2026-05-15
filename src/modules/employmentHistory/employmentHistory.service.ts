import { prismaClient } from "../../config/db.js";
import { UnauthorizedError } from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";
import type { CreateEmploymentHistoryInput } from "./employmentHistory.validation.js";

export class EmploymentHistoryService {
  static async createEmploymentHistoryService(
    user : User,
    employeeId: string,
    payload: CreateEmploymentHistoryInput,
  ) {

    if (!user || user.role !== "HR_ADMIN") {
          throw new UnauthorizedError("You Are Not Authorized To Do This");
        }
        
    // check employee exists
    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,companyId : user.companyId
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // find current active role
      const currentRole = await tx.employmentHistory.findFirst({
        where: {
          employeeId,
          isCurrent: true, companyId : employee.companyId
        },
      });

      // close previous current role
      if (currentRole && payload.isCurrent) {
        await tx.employmentHistory.update({
          where: {
            id: currentRole.id,
          },
          data: {
            isCurrent: false,
            endDate: payload.startDate,
          },
        });
      }

      // create new employment history
      const historyData: any = {
        employeeId,

        companyId: employee.companyId,

        jobTitle: payload.jobTitle,

        startDate: payload.startDate,

        isCurrent: payload.isCurrent,
      };

      if (payload.endDate) {
        historyData.endDate = payload.endDate;
      }

      const departmentId = payload.departmentId ?? employee.departmentId;

      if (departmentId) {
        historyData.departmentId = departmentId;
      }

      const history = await tx.employmentHistory.create({
        data: historyData,
      });

      return history;
    });

    return result;
  }
  

  static async getEmploymentHistoryService(user : User,
    employeeId: string){
      if (!user || user.role !== "HR_ADMIN") {
          throw new UnauthorizedError("You Are Not Authorized To Do This");
        }
        
    // check employee exists
    const employee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId : user.companyId
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const employeeHistory = await prismaClient.employmentHistory.findMany({
    where: {
      employeeId,
      companyId: user.companyId,
    },
    orderBy: {
      startDate: "desc", // chronological ordering
    },
  });

    return employeeHistory
    }
  //   static async updateEmploymentHistoryService(
  //   user : User,
  //   employeeId: string,
  //   payload: CreateEmploymentHistoryInput,
  // ) {

  //   if (!user || user.role !== "HR_ADMIN") {
  //         throw new UnauthorizedError("You Are Not Authorized To Do This");
  //       }
        
  //   // check employee exists
  //   const employee = await prismaClient.employee.findFirst({
  //     where: {
  //       id: employeeId,companyId : user.companyId
  //     },
  //   });

  //   if (!employee) {
  //     throw new Error("Employee not found");
  //   }

  //   const result = await prismaClient.$transaction(async (tx) => {
  //     // find current active role
  //     const currentRole = await tx.employmentHistory.findFirst({
  //       where: {
  //         employeeId,
  //         isCurrent: true,
  //       },
  //     });

  //     // close previous current role
  //     if (currentRole && payload.isCurrent) {
  //       await tx.employmentHistory.update({
  //         where: {
  //           id: currentRole.id,
  //         },
  //         data: {
  //           isCurrent: false,
  //           endDate: payload.startDate,
  //         },
  //       });
  //     }

  //     // create new employment history
  //     const historyData: any = {
  //       employeeId,

  //       companyId: employee.companyId,

  //       jobTitle: payload.jobTitle,

  //       startDate: payload.startDate,

  //       isCurrent: payload.isCurrent,
  //     };

  //     if (payload.endDate) {
  //       historyData.endDate = payload.endDate;
  //     }

  //     const departmentId = payload.departmentId ?? employee.departmentId;

  //     if (departmentId) {
  //       historyData.departmentId = departmentId;
  //     }

  //     const history = await tx.employmentHistory.create({
  //       data: historyData,
  //     });

  //     return history;
  //   });

  //   return result;
  // }
}
