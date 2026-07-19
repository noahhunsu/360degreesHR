import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type {
  ApproveOrRejectSalaryAdvanceRequestInput,
  CancelSalaryAdvanceInput,
  ConfirmPaidSalaryAdvanceRequestInput,
  CreateSalaryAdvanceInput,
  GetPresignedUrlInputForCompanyDebtsInput,
} from "./companyDebts.validation.js";
import {
  assertHR,
  assertUser,
  getEmployee,
  getRole,
} from "../../utils/global.utils.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { aws3Client } from "../../config/aws_s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { GetPresignedUrlInputForApplicationInput } from "../jobApplication/jobApplication.validation.js";

export class LoansAndAdvanceService {
  static async createSalaryAdvanceService(
    user: User,
    payload: CreateSalaryAdvanceInput,
  ) {
    assertUser(user)

    const employee = await getEmployee(user);

    //  Might be up for debate but i don't think you should be able to create another salary advance when one is pending

    const existingAdvance = await prismaClient.salaryAdvance.findFirst({
      where: {
        employeeId: employee.id,
        companyId: user.companyId,
        status: "PENDING",
      },
    });
    if (existingAdvance) {
      throw new ConflictError("An existing advance request already exists");
    }
    const salaryAdvance = await prismaClient.salaryAdvance.create({
      data: {
        employeeId: employee.id,
        companyId: user.companyId,
        requestedAmount: payload.requestedAmount,
        ...(payload.reason && { reason: payload.reason }),
        requestedById: user.userId,
      },
    });
    return salaryAdvance;
  }

  static async updateSalaryAdvanceService(
    user: User,
    salaryAdvanceId: string,
    payload: CreateSalaryAdvanceInput,
  ) {
    if (!user) {
      throw new UnauthorizedError("You are not authorized");
    }

    const employee = await getEmployee(user);

    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
      where: {
        id: salaryAdvanceId,
        companyId: user.companyId,
        employeeId: employee.id,
        status: "PENDING",
      },
    });

    if (!salaryAdvanceRequest) {
      throw new NotFoundError("No salary advance request with this ID found");
    }

    const updatedSalaryAdvance = await prismaClient.salaryAdvance.update({
      where: {
        id: salaryAdvanceRequest.id,
      },
      data: {
        ...(payload.requestedAmount && {
          requestedAmount: payload.requestedAmount,
        }),
        ...(payload.reason && { reason: payload.reason }),
      },
    });
    return updatedSalaryAdvance;
  }
  static async cancelSalaryAdvanceService(
    user: User,
    salaryAdvanceId: string,
  ) {
    if (!user) {
      throw new UnauthorizedError("You are not authorized");
    }

    const employee = await getEmployee(user);

    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
      where: {
        id: salaryAdvanceId,
        companyId: user.companyId,
        employeeId: employee.id,
        status: "PENDING",
      },
    });

    if (!salaryAdvanceRequest) {
      throw new NotFoundError("No salary advance request with this ID found");
    }

    // if (salaryAdvanceRequest.status === "CANCELLED") {
    //   throw new ConflictError("This advance request has been canceled already");
    // }
    const updatedSalaryAdvance = await prismaClient.salaryAdvance.update({
      where: {
        id: salaryAdvanceRequest.id,
      },
      data: {
        status : "CANCELLED",
      },
    });
    return updatedSalaryAdvance;
  }
 

  static async getAllSalaryAdvanceRequestService(user: User) {
    assertUser(user);
    const role = getRole(user);

    if (role !== "HR_ADMIN") {
      const employee = await getEmployee(user);

      return await prismaClient.salaryAdvance.findMany({
        where: {
          companyId: user.companyId,
          employeeId: employee?.id,
        },
      });
    }

    return await prismaClient.salaryAdvance.findMany({
      where: {
        companyId: user.companyId,
      },
    });
  }
  static async getSingleSalaryAdvanceRequestService(
    user: User,
    salaryAdvanceId: string,
  ) {
    assertUser(user);
    const role = getRole(user);

    if (role !== "HR_ADMIN") {
      const employee = await getEmployee(user);

      return await prismaClient.salaryAdvance.findFirst({
        where: {
          id: salaryAdvanceId,
          companyId: user.companyId,
          employeeId: employee?.id,
        },
      });
    }

    return await prismaClient.salaryAdvance.findMany({
      where: {
        companyId: user.companyId,
        id: salaryAdvanceId,
      },
    });
  }

  static async approveOrRejectSalaryAdvanceRequestService(
    user: User,
    salaryAdvanceId: string,
    payload: ApproveOrRejectSalaryAdvanceRequestInput,
  ) {
    // Would need to confirm if only hr should be able to handle salary advance requests

    assertHR(user);

    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
      where: {
        companyId: user.companyId,
        id: salaryAdvanceId,
      },
    });

    if (!salaryAdvanceRequest) {
      throw new NotFoundError("Salary advance request not found");
    }

    if (payload.reject && !payload.rejection_reason) {
      throw new BadRequestError("A rejection reason should be stated");
    }

    const updatedSalaryAdvanceRequest = await prismaClient.salaryAdvance.update(
      {
        where: {
          id: salaryAdvanceRequest.id,
        },
        data: {
          ...(payload.reject &&
            payload.rejection_reason && {
              reason: payload.rejection_reason,
            }),
          ...(payload.reject && {
            status: "REJECTED",
          }),
          ...(payload.review_comment && {
            reviewComment: payload.review_comment,
          }),
          ...(!payload.reject && {
            approvedDate: new Date(),
          }),
          ...(!payload.reject && {
            status: "APPROVED",
          }),
          ...(!payload.reject && {
            approvedAmount:
              payload.approvedAmount ?? salaryAdvanceRequest.requestedAmount,
          }),
          approvedById: user.userId,
        },
      },
    );
    return updatedSalaryAdvanceRequest;
  }

  static async confirmPaidSalaryAdvanceRequestService(
    user: User,
    salaryAdvanceId: string,
    payload: ConfirmPaidSalaryAdvanceRequestInput,
  ) {
    assertHR(user);

    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
      where: {
        companyId: user.companyId,
        id: salaryAdvanceId,
      },
    });

    if (!salaryAdvanceRequest) {
      throw new NotFoundError("Salary advance not found");
    }

    if (salaryAdvanceRequest.status !== "APPROVED") {
      throw new BadRequestError("Only approved requests can be marked as paid");
    }

    const updatedSalaryAdvance = await prismaClient.$transaction(async (tx) => {
      const salaryAdvance = await tx.salaryAdvance.update({
        where: {
          id: salaryAdvanceRequest.id,
        },
        data: {
          status: "PAID",
        },
      });

      await tx.advanceReceipt.create({
        data: {
          fileName: payload.fileName,

          storageKey: payload.storageKey,

          mimeType: payload.mimeType,

          uploadedById: user.userId,

          salaryAdvanceId: salaryAdvance.id,
        },
      });
    });
    return updatedSalaryAdvance
  }
  
  // THIS IS DONE BY THE PAYROLL RUN AFTER DEDUCTIONS HAVE BEEN MADE
  static async closeSalaryAdvanceService(
    user: User,
    salaryAdvanceId: string,
    payrollRunId : string,
    employeeId : string,
  ) {
    if (!user) {
      throw new UnauthorizedError("You are not authorized");
    }

    const employee = await prismaClient.employee.findFirst({
      where : {
        companyId : user.companyId , id : employeeId
      }
    })

    if(!employee){
      throw new NotFoundError("Employee Not Found")
    }

    const salaryAdvanceRequest = await prismaClient.salaryAdvance.findFirst({
      where: {
        id: salaryAdvanceId,
        companyId: user.companyId,
        employeeId: employee.id,
        status: "PAID",
      },
    });

    if (!salaryAdvanceRequest) {
      throw new NotFoundError("No salary advance request with this ID found");
    }
    const updatedSalaryAdvance = await prismaClient.salaryAdvance.update({
      where : {
        id : salaryAdvanceRequest.id
      } , 
      data : {
        status : "CLOSED", 
        payrollRunId
      }
    })
    return updatedSalaryAdvance;
  }

  static async getEmployeeSalaryAdvanceForPayrollService(employeeId : string){
    const employeeSalaryAdvance = await prismaClient.salaryAdvance.findFirst({
      where:{
        employeeId ,
        status : "PAID"
      }
    })

    if(!employeeSalaryAdvance){
      return null
    }
    return employeeSalaryAdvance
  }

   static async generatePresignedUrlApplicationService(
      payload: GetPresignedUrlInputForCompanyDebtsInput,
    ) {
      // generate unique storage key
      // const fileExtension = payload.fileName.split(".").pop();
  
      const safeFileName = payload.fileName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");
      const storageKey = `paid_advance_docs/${Date.now()}-${safeFileName}`;
  
      // create upload command
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
  
        Key: storageKey,
  
        ContentType: payload.mimeType,
      });
  
      // generate signed url
      const uploadUrl = await getSignedUrl(aws3Client, command, {
        expiresIn: 60 * 5,
      });
  
      // This returned upload url is then used by frontend to do a put request
  
      return {
        message: "Upload URL generated successfully",
  
        uploadUrl,
  
        storageKey,
  
        expiresIn: 300,
      };
    }
}
