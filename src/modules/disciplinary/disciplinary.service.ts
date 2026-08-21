// Creating new employee
// Get all employees
// Get specific employee
// update specific employee
// Delete specific employee

import { prismaClient } from "../../config/db.js";
import {
  MatchError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";
import type { CreateDisciplinaryInput, ResolveDisciplinaryInput } from "./disciplinary.validation.js";

export class DisciplinaryService {
 

 static async createDisciplinaryRecordService(
  user: User,
  employeeId: string,
  payload: CreateDisciplinaryInput
) {
  // =========================
  // EMPLOYEE CHECK
  // =========================

  const employee = await prismaClient.employee.findFirst({
    where: {
      id: employeeId,
      companyId: user.companyId,
    },
  });

  if (!employee) {
    throw new NotFoundError("Employee not found");
  }

  // =========================
  // CREATE RECORD
  // =========================
  if (employee.companyId !== user.companyId){
    throw new MatchError("CompanyId Mismatch");
  }


  const disciplinaryRecord =
    await prismaClient.disciplinaryRecord.create({
      data: {
        companyId: user.companyId,

        employeeId: employee.id,

        type: payload.type,

        severity: payload.severity,

        title: payload.title,

        description: payload.description,

        createdById: user.userId,
      },
    });

  return disciplinaryRecord;
}



static async getDisciplinaryRecordService(
  user: User,
  employeeId: string
) {
  // =========================
  // EMPLOYEE CHECK
  // =========================

  const employee = await prismaClient.employee.findFirst({
    where: {
      id: employeeId,
      companyId: user.companyId,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if(user.companyId !== employee.companyId){
    throw new MatchError("CompanyId don't match ")
  }
  // =========================
  // FETCH RECORDS
  // =========================

 const records =
  await prismaClient.disciplinaryRecord.findMany({
    where: {
      employeeId,
      companyId: employee.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {

      // =========================
      // EMPLOYEE DETAILS
      // =========================
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeCode: true,
        },
      },

      // =========================
      // CREATED BY
      // =========================
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      // =========================
      // RESOLVED BY
      // =========================
      resolvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return records;
}
static async resolveDisciplinaryRecordService(
  user: User,
  disciplinaryId: string,
  payload: ResolveDisciplinaryInput
) {

  // =========================
  // FIND RECORD
  // =========================

  const record =
    await prismaClient.disciplinaryRecord.findFirst({
      where: {
        id: disciplinaryId,
        companyId: user.companyId,
      },
    });

  if (!record) {
    throw new Error("Disciplinary record not found");
  }

  if(user.companyId !== record.companyId){
    throw new MatchError("Company Id don't match")
  }
  // =========================
  // ALREADY RESOLVED CHECK
  // =========================

  if (record.status === "RESOLVED") {
    throw new Error(
      "Disciplinary record already resolved"
    );
  }

  // =========================
  // RESOLVE RECORD
  // =========================

  const updatedRecord =
    await prismaClient.disciplinaryRecord.update({
      where: {
        id: record.id,
      },

      data: {
        status: "RESOLVED",

        resolutionNotes :payload.resolutionNotes,

        resolvedAt: new Date(),

        resolvedById: user.userId,
      },
    });

  return updatedRecord;
}

}
