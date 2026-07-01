import type { Prisma, PrismaClient } from "@prisma/client";
import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";

import type {
  ApproveLeaveRequestInput,
  CreateLeaveRequestInput,
  CreateLeaveTypeInput,
  CreateOrUpdateEmployeeLeaveBalanceInput,
  CreatePublicHolidayInput,
  GetPresignedUrlInputForLeaveApplicationInput,
  LeavePolicyInput,
  RejectLeaveRequestInput,
  UpdateLeaveTypeInput,
  UpdatePublicHolidayInput,
} from "./leaveApplication.validation.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { aws3Client } from "../../config/aws_s3.js";

export class LeaveManagementService {
  static async createLeaveTypeService(
    payload: CreateLeaveTypeInput,
    hrUser: User,
  ) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are unauthorized to perform this action",
      );
    }

    const existingLeaveType = await prismaClient.leaveType.findFirst({
      where: {
        companyId: hrUser.companyId,
        name: {
          equals: payload.name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingLeaveType) {
      throw new ConflictError("Leave Type with name already exists");
    }

    if (payload.requiresDocument && !payload.documentType) {
      throw new BadRequestError(
        "Document type is required when requiresDocument is true",
      );
    }

    if (payload.requiresApproval && !payload.approvalFrom) {
      throw new BadRequestError(
        "Approval source is required when requiresApproval is true",
      );
    }
    const leaveType = await prismaClient.leaveType.create({
      data: {
        companyId: hrUser.companyId,
        name: payload.name.toLowerCase(),
        ...(payload.description && { description: payload.description }),
        daysPerYear: payload.daysPerYear,
        ...(payload.isPaid !== undefined && { isPaid: payload.isPaid }),
        ...(payload.requiresDocument !== undefined && {
          requiresDocument: payload.requiresDocument,
        }),
        ...(payload.requiresDocument &&
          payload.documentType && { documentType: payload.documentType }),
        ...(payload.requiresApproval !== undefined && {
          requiresApproval: payload.requiresApproval,
        }),
        ...(payload.requiresApproval &&
          payload.approvalFrom && { approvalFrom: payload.approvalFrom }),

        ...(payload.minimumMonthsOfService && {
          minimumMonthsOfService: payload.minimumMonthsOfService,
        }),
        ...(payload.noticePeriodDays && {
          noticePeriodDays: payload.noticePeriodDays,
        }),
        ...(payload.allowCarryForward !== undefined && {
          allowCarryForward: payload.allowCarryForward,
        }),
        ...(payload.maxCarryForwardDays && {
          maxCarryForwardDays: payload.maxCarryForwardDays,
        }),
        ...(payload.allowHalfDay !== undefined && {
          allowHalfDay: payload.allowHalfDay,
        }),
        ...(payload.availableDuringProbation !== undefined && {
          availableDuringProbation: payload.availableDuringProbation,
        }),
      },
    });

    return leaveType;
  }

  static async getAllLeaveTypeService(user: User) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    if (user.role === "HR_ADMIN") {
      return await prismaClient.leaveType.findMany({
        where: {
          companyId: user.companyId,
        },
      });
    }
    return await prismaClient.leaveType.findMany({
      where: {
        companyId: user.companyId,
        isActive: true,
      },
    });
  }
  static async getSingleLeaveTypeService(leaveTypeId: string, user: User) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    if (user.role === "HR_ADMIN") {
      return await prismaClient.leaveType.findFirst({
        where: {
          id: leaveTypeId,
          companyId: user.companyId,
        },
      });
    }

    return await prismaClient.leaveType.findFirst({
      where: {
        id: leaveTypeId,
        companyId: user.companyId,
        isActive: true,
      },
    });
  }

  static async updateLeaveTypeService(
    user: User,
    leaveTypeId: string,
    payload: UpdateLeaveTypeInput,
  ) {
    if (!user || user.role !== "HR_ADMIN") {
      throw new UnauthorizedError();
    }

    const leave = await prismaClient.leaveType.findFirst({
      where: {
        companyId: user.companyId,
        id: leaveTypeId,
      },
    });

    if (!leave) {
      throw new NotFoundError("Leave type not found");
    }
    const leaveType = await prismaClient.leaveType.update({
      where: {
        id: leaveTypeId,
      },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.daysPerYear && { daysPerYear: payload.daysPerYear }),
        ...(payload.description && { description: payload.description }),

        ...(payload.isPaid !== undefined && { isPaid: payload.isPaid }),
        ...(payload.requiresDocument !== undefined && {
          requiresDocument: payload.requiresDocument,
        }),
        ...(payload.requiresDocument &&
          payload.documentType && { documentType: payload.documentType }),
        ...(payload.requiresApproval !== undefined && {
          requiresApproval: payload.requiresApproval,
        }),
        ...(payload.requiresApproval &&
          payload.approvalFrom && { approvalFrom: payload.approvalFrom }),
        ...(payload.minimumMonthsOfService && {
          minimumMonthsOfService: payload.minimumMonthsOfService,
        }),
        ...(payload.noticePeriodDays && {
          noticePeriodDays: payload.noticePeriodDays,
        }),
        ...(payload.allowCarryForward !== undefined && {
          allowCarryForward: payload.allowCarryForward,
        }),
        ...(payload.maxCarryForwardDays && {
          maxCarryForwardDays: payload.maxCarryForwardDays,
        }),
        ...(payload.allowHalfDay !== undefined && {
          allowHalfDay: payload.allowHalfDay,
        }),
        ...(payload.availableDuringProbation !== undefined && {
          availableDuringProbation: payload.availableDuringProbation,
        }),
      },
    });
    return leaveType;
  }

  static async createOrUpdateEmployeeLeaveBalanceService(
    user: User,
    payload: CreateOrUpdateEmployeeLeaveBalanceInput,
  ) {
    if (!user || user.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You need to be authorized");
    }

    const employee = await prismaClient.employee.findFirst({
      where: {
        companyId: user.companyId,
        id: payload.employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee with ID not found");
    }

    const leaveType = await prismaClient.leaveType.findFirst({
      where: {
        id: payload.leaveTypeId,
        companyId: user.companyId,
      },
    });

    if (!leaveType) {
      throw new NotFoundError("Leave Type with ID not found");
    }

    const existingBalance = await prismaClient.employeeLeaveBalance.findFirst({
      where: {
        employeeId: payload.employeeId,
        leaveTypeId: payload.leaveTypeId,
      },
    });

    // CREATE
    if (!existingBalance) {
      const allocatedDays = payload.allocatedDays ?? leaveType.daysPerYear;

      return prismaClient.employeeLeaveBalance.create({
        data: {
          employeeId: payload.employeeId,
          leaveTypeId: payload.leaveTypeId,

          allocatedDays,
          remainingDays: allocatedDays,
          usedDays: 0,
        },
      });
    }

    // UPDATE
    const allocatedDays =
      payload.allocatedDays ?? existingBalance.allocatedDays;

    const remainingDays = allocatedDays - existingBalance.usedDays;

    if (remainingDays < 0) {
      throw new BadRequestError("Used days cannot exceed allocated days");
    }

    return prismaClient.employeeLeaveBalance.update({
      where: {
        id: existingBalance.id,
      },

      data: {
        ...(payload.allocatedDays !== undefined && {
          allocatedDays,
        }),
        remainingDays,
      },
    });
  }

  static async createLeaveRequestService(
    user: User,
    leaveTypeId: string,
    payload: CreateLeaveRequestInput,
  ) {
    if (!user) {
      throw new UnauthorizedError("You must be authorized");
    }
    const employee = await prismaClient.employee.findFirst({
      where: {
        companyId: user.companyId,
        userId: user.userId,
      },
    });
    if (!employee) {
      throw new NotFoundError("This employee does not exist");
    }
    if (payload.reliever) {
      const reliever = await prismaClient.employee.findFirst({
        where: {
          companyId: user.companyId,
          id: payload.reliever,
        },
      });
      if (!reliever) {
        throw new NotFoundError("This reliever does not exist");
      }
      if (payload.reliever === employee.id) {
        throw new BadRequestError(
          "You cannot assign yourself as your own reliever.",
        );
      }
    }
    const leaveType = await prismaClient.leaveType.findFirst({
      where: {
        id: leaveTypeId,
        companyId: user.companyId,
      },
    });
    if (!leaveType) {
      throw new NotFoundError("No leave with this ID exists");
    }
    if (!leaveType.isActive) {
      throw new BadRequestError("Leave Type is inactive");
    }

    const employeeLeaveBalance =
      await prismaClient.employeeLeaveBalance.findFirst({
        where: {
          employeeId: employee.id,
          leaveTypeId: leaveTypeId,
        },
      });

    if (!employeeLeaveBalance) {
      throw new NotFoundError("This leave type does not apply to you ");
    }

    // check if probation workers cant take leaves
    if (!leaveType.availableDuringProbation && employee.isProbation) {
      throw new BadRequestError(
        "Probational Employees can't go on this kind of leave",
      );
    }

    // check minimum number of months
    const today = new Date();

    const monthsOfService =
      (today.getFullYear() - employee.hireDate.getFullYear()) * 12 +
      (today.getMonth() - employee.hireDate.getMonth());

    if (monthsOfService < leaveType.minimumMonthsOfService) {
      throw new BadRequestError(
        `You must complete at least ${leaveType.minimumMonthsOfService} months before applying for this leave`,
      );
    }

    const thisDay = new Date();
    thisDay.setHours(0, 0, 0, 0);

    payload.startDate.setHours(0, 0, 0, 0);
    payload.endDate.setHours(0, 0, 0, 0);

    if (payload.startDate > payload.endDate) {
      throw new BadRequestError("Start date cannot be after end date.");
    }
    const daysBeforeLeave = Math.ceil(
      (payload.startDate.getTime() - thisDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysBeforeLeave < leaveType.noticePeriodDays) {
      throw new BadRequestError(
        `This leave requires at least ${leaveType.noticePeriodDays} days notice`,
      );
    }
    // Check if leave overlap with any existing leave
    const overlappingLeave = await prismaClient.leaveRequest.findFirst({
      where: {
        employeeId: employee.id,
        status: {
          in: ["APPROVED", "PENDING"],
        },
        AND: [
          {
            startDate: {
              lte: payload.endDate,
            },
          },
          {
            endDate: {
              gte: payload.startDate,
            },
          },
        ],
      },
    });

    if (overlappingLeave) {
      throw new ConflictError(
        "You already have a leave request covering these dates",
      );
    }

    let publicHolidays = await prismaClient.publicHoliday.findMany({
      where: {
        companyId: user.companyId,
      },
    });

    const publicHolidayDates = publicHolidays.map((holiday) => holiday.date);
    const leavePolicy = await prismaClient.leavePolicy.findFirst({
      where: {
        companyId: user.companyId,
      },
    });

    const totalCalendarDays =
      Math.floor(
        (payload.endDate.getTime() - payload.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    const totalDays = this.calculateLeaveDays(
      payload.startDate,
      payload.endDate,
      leavePolicy?.excludeWeekends ?? true,
      publicHolidayDates,
    );

    if (totalDays <= 0) {
      throw new BadRequestError(
        "The selected period contains no working days.",
      );
    }

    // check employee balance
    if (employeeLeaveBalance.remainingDays < totalDays) {
      throw new BadRequestError(
        `Insufficient leave balance . Balance : ${employeeLeaveBalance.remainingDays} , RequesteDays : ${totalCalendarDays}`,
      );
    }
    if (leaveType.requiresDocument && !payload.documents?.length) {
      throw new BadRequestError(
        "Supporting documents are required for this leave.",
      );
    }

    const transaction = await prismaClient.$transaction(async (tx) => {
      const leaveRequest = await tx.leaveRequest.create({
        data: {
          employeeId: employee.id,
          leaveTypeId: leaveType.id,
          startDate: payload.startDate,
          endDate: payload.endDate,
          totalDays: totalDays,
          ...(payload.reliever && { relievedById: payload.reliever }),
          status: leaveType.requiresApproval ? "PENDING" : "APPROVED",
        },
      });
      // if (!leaveType.requiresApproval) {
      //   await tx.employeeLeaveBalance.update({
      //     where: {
      //       id: employeeLeaveBalance.id,
      //     },
      //     data: {
      //       remainingDays: employeeLeaveBalance.remainingDays - totalDays,

      //       usedDays: employeeLeaveBalance.usedDays + totalDays,
      //     },
      //   });
      // }

      await tx.leaveApprovalHistory.create({
        data: {
          leaveRequestId: leaveRequest.id,
          action: "SUBMITTED",
          actedById: user.userId,
        },
      });

      await tx.leaveRequestDocument.createMany({
        data: payload.documents!.map((doc) => ({
          leaveId: leaveRequest.id,
          fileName: doc.fileName,
          storageKey: doc.storageKey,
          mimeType: doc.mimeType,
          uploadedById: employee.id,
        })),
      });

      return leaveRequest;
    });
    return transaction;
  }

  static async cancelLeaveRequestService(user: User, leaveRequestId: string) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }
    const employee = await prismaClient.employee.findFirst({
      where: {
        companyId: user.companyId,
        userId: user.userId,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee record not found");
    }
    const leaveRequest = await prismaClient.leaveRequest.findUnique({
      where: {
        id: leaveRequestId,
      },
    });

    if (!leaveRequest) {
      throw new NotFoundError("Leave request not found");
    }

    if (leaveRequest.employeeId !== employee.id) {
      throw new BadRequestError("You can only cancel your own leave request");
    }
    const leaveType = await prismaClient.leaveType.findFirst({
      where: {
        id: leaveRequest.leaveTypeId,
        companyId: user.companyId,
      },
    });

    if (!leaveType) {
      throw new NotFoundError("Leave type does not exist");
    }

    if (leaveRequest.status !== "PENDING") {
      throw new BadRequestError("Only Pending requests can be cancelled");
    }

    const approvalHistory = await prismaClient.leaveApprovalHistory.findFirst({
      where: {
        leaveRequestId: leaveRequest.id,
      },
    });

    if (!approvalHistory) {
      throw new NotFoundError("Approval History Not Found");
    }

    const transaction = await prismaClient.$transaction(async (tx) => {
      const updatedLeaveRequest = await tx.leaveRequest.update({
        where: {
          id: leaveRequest.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.leaveApprovalHistory.create({
        data: {
          leaveRequestId: leaveRequest.id,
          action: "CANCELLED",
          actedById: user.userId,
        },
      });

      return updatedLeaveRequest;
    });
    return transaction;
  }
static async rejectLeaveRequestService(
  user: User,
  leaveRequestId: string,
  payload: RejectLeaveRequestInput,
) {
  if (!user) {
    throw new UnauthorizedError("You need to be authorized");
  }

  const leaveRequest = await prismaClient.leaveRequest.findUnique({
    where: {
      id: leaveRequestId,
    },
    include: {
      leaveType: true,
      employee: true,
    },
  });

  if (!leaveRequest) {
    throw new NotFoundError("Leave request not found");
  }

  if (leaveRequest.employee.companyId !== user.companyId) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (leaveRequest.status !== "PENDING") {
    throw new BadRequestError(
      "Only pending leave requests can be rejected",
    );
  }

  // get the leave type 
  const leaveType = await prismaClient.leaveType.findFirst({
    where : {
      id : leaveRequest.leaveTypeId,
      companyId : user.companyId , 
    }
  })
   if(!leaveType){
    throw new NotFoundError("No leave type  found")
  }
  const employee = await prismaClient.employee.findFirst({
    where : {
      companyId : user.companyId , id : leaveRequest.employeeId
    }
  })
  if(!employee){
    throw new NotFoundError("No employee found")
  }
  
  const department = await prismaClient.department.findFirst({
    where : {
       id : employee.departmentId!,
      companyId : user.companyId 
    }
  })
  if(!department){
    throw new NotFoundError("No department found")
  }
  const isHR = user.role === "HR_ADMIN";

  const isHOD = leaveType.approvalFrom === "HOD" && user.userId === department.headEmployeeId

  if (
    leaveRequest.leaveType.approvalFrom === "HR" &&
    !isHR
  ) {
    throw new UnauthorizedError(
      "Only HR can reject this leave request",
    );
  }

  if (
    leaveRequest.leaveType.approvalFrom === "HOD" &&
    !(isHR || isHOD)
  ) {
    throw new UnauthorizedError(
      "Only HR or HOD can reject this leave request",
    );
  }

  return await prismaClient.$transaction(async (tx) => {
    const updatedRequest =
      await tx.leaveRequest.update({
        where: {
          id: leaveRequest.id,
        },
        data: {
          status: "REJECTED",
          rejectedById: user.userId,
          rejectedAt: new Date(),
          rejectionReason: payload.reason,
        },
      });

    await tx.leaveApprovalHistory.create({
      data: {
        leaveRequestId: leaveRequest.id,
        actedById: user.userId,
        action: "REJECTED",
        comment: payload.reason,
      },
    });

    return updatedRequest;
  });
}

 static async approveLeaveRequestService(
  user: User,
  leaveRequestId: string,
  payload: ApproveLeaveRequestInput,
) {
  if (!user) {
    throw new UnauthorizedError("You need to be authorized");
  }

  const leaveRequest = await prismaClient.leaveRequest.findUnique({
    where: {
      id: leaveRequestId,
    },
    include: {
      leaveType: true,
      employee: true,
    },
  });

  if (!leaveRequest) {
    throw new NotFoundError("Leave request not found");
  }

  if (leaveRequest.employee.companyId !== user.companyId) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (leaveRequest.status !== "PENDING") {
    throw new BadRequestError(
      "Only pending leave requests can be approved",
    );
  }

  // get the leave type 
  const leaveType = await prismaClient.leaveType.findFirst({
    where : {
      id : leaveRequest.leaveTypeId,
      companyId : user.companyId , 
    }
  })
   if(!leaveType){
    throw new NotFoundError("No leave type  found")
  }
  const employee = await prismaClient.employee.findFirst({
    where : {
      companyId : user.companyId , id : leaveRequest.employeeId
    }
  })
  if(!employee){
    throw new NotFoundError("No employee found")
  }
  
  const department = await prismaClient.department.findFirst({
    where : {
       id : employee.departmentId!,
      companyId : user.companyId 
    }
  })
  if(!department){
    throw new NotFoundError("No department found")
  }

  const isHR = user.role === "HR_ADMIN";

  const isHOD = leaveType.approvalFrom === "HOD" && user.userId === department.headEmployeeId 
  if (
    leaveRequest.leaveType.approvalFrom === "HR" &&
    !isHR
  ) {
    throw new UnauthorizedError(
      "Only HR can approve this leave request",
    );
  }

  if (
    leaveRequest.leaveType.approvalFrom === "HOD" &&
    !(isHR || isHOD)
  ) {
    throw new UnauthorizedError(
      "Only HR or HOD can approve this leave request",
    );
  }

  const balance =
    await prismaClient.employeeLeaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId: {
          employeeId: leaveRequest.employeeId,
          leaveTypeId: leaveRequest.leaveTypeId,
        },
      },
    });

  if (!balance) {
    throw new NotFoundError(
      "Employee leave balance not found",
    );
  }

  if (balance.remainingDays < leaveRequest.totalDays) {
    throw new BadRequestError(
      "Employee no longer has sufficient leave balance",
    );
  }

  return await prismaClient.$transaction(async (tx) => {
    await tx.employeeLeaveBalance.update({
      where: {
        id: balance.id,
      },
      data: {
        remainingDays:
          balance.remainingDays - leaveRequest.totalDays,

        usedDays:
          balance.usedDays + leaveRequest.totalDays,
      },
    });

    const updatedRequest =
      await tx.leaveRequest.update({
        where: {
          id: leaveRequest.id,
        },
        data: {
          status: "APPROVED",
          approvedById: user.userId,
          approvedAt: new Date(),
        },
      });

    await tx.leaveApprovalHistory.create({
      data: {
        leaveRequestId: leaveRequest.id,
        actedById: user.userId,
        action: "APPROVED",
        comment: payload.comment,
      },
    });

    return updatedRequest;
  });
}

static async createLeavePolicyService(
    user: User,
    payload: LeavePolicyInput,
) {
    if (!user || user.role !== "HR_ADMIN") {
        throw new UnauthorizedError(
            "You are not authorized to perform this action",
        );
    }

    const existingPolicy =
        await prismaClient.leavePolicy.findUnique({
            where: {
                companyId: user.companyId,
            },
        });

    if (existingPolicy) {
        throw new ConflictError(
            "Leave policy already exists for this company.",
        );
    }

    return await prismaClient.leavePolicy.create({
        data: {
  companyId: user.companyId,

  excludeWeekends:
    payload.excludeWeekends ?? true,

  excludePublicHolidays:
    payload.excludePublicHolidays ?? true,

  workingDays:
    payload.workingDays ?? [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
    ],

  minimumMonthsBeforeLeave:
    payload.minimumMonthsBeforeLeave ?? 0,

  minimumNoticeDays:
    payload.minimumNoticeDays ?? 0,

  allowCarryForward:
    payload.allowCarryForward ?? false,

  ...(payload.maxCarryForwardDays !== undefined && {
    maxCarryForwardDays:
      payload.maxCarryForwardDays,
  }),

  allowNegativeBalance:
    payload.allowNegativeBalance ?? false,

  allowLeaveEncashment:
    payload.allowLeaveEncashment ?? false,

  allowEmployeeCancellation:
    payload.allowEmployeeCancellation ?? true,

  ...(payload.cancellationNoticeDays !== undefined && {
    cancellationNoticeDays:
      payload.cancellationNoticeDays,
  }),

  allowHalfDayLeave:
    payload.allowHalfDayLeave ?? false,

  allowLeaveDuringProbation:
    payload.allowLeaveDuringProbation ?? false,
}
    });
}

static async updateLeavePolicyService(
    user: User,
    payload: LeavePolicyInput,
) {
    if (!user || user.role !== "HR_ADMIN") {
        throw new UnauthorizedError(
            "You are not authorized to perform this action",
        );
    }

    const policy =
        await prismaClient.leavePolicy.findUnique({
            where: {
                companyId: user.companyId,
            },
        });

    if (!policy) {
        throw new NotFoundError(
            "Leave policy not found.",
        );
    }

    return await prismaClient.leavePolicy.update({
        where: {
            companyId: user.companyId,
        },

        data: {
            ...(payload.excludeWeekends !== undefined && {
                excludeWeekends:
                    payload.excludeWeekends,
            }),

            ...(payload.excludePublicHolidays !== undefined && {
                excludePublicHolidays:
                    payload.excludePublicHolidays,
            }),

            ...(payload.workingDays && {
                workingDays: payload.workingDays,
            }),

            ...(payload.minimumMonthsBeforeLeave !== undefined && {
                minimumMonthsBeforeLeave:
                    payload.minimumMonthsBeforeLeave,
            }),

            ...(payload.minimumNoticeDays !== undefined && {
                minimumNoticeDays:
                    payload.minimumNoticeDays,
            }),

            ...(payload.allowCarryForward !== undefined && {
                allowCarryForward:
                    payload.allowCarryForward,
            }),

            ...(payload.maxCarryForwardDays !== undefined && {
                maxCarryForwardDays:
                    payload.maxCarryForwardDays,
            }),

            ...(payload.allowNegativeBalance !== undefined && {
                allowNegativeBalance:
                    payload.allowNegativeBalance,
            }),

            ...(payload.allowLeaveEncashment !== undefined && {
                allowLeaveEncashment:
                    payload.allowLeaveEncashment,
            }),

            ...(payload.allowEmployeeCancellation !== undefined && {
                allowEmployeeCancellation:
                    payload.allowEmployeeCancellation,
            }),

            ...(payload.cancellationNoticeDays !== undefined && {
                cancellationNoticeDays:
                    payload.cancellationNoticeDays,
            }),

            ...(payload.allowHalfDayLeave !== undefined && {
                allowHalfDayLeave:
                    payload.allowHalfDayLeave,
            }),

            ...(payload.allowLeaveDuringProbation !== undefined && {
                allowLeaveDuringProbation:
                    payload.allowLeaveDuringProbation,
            }),
        },
    });
}

static async getLeavePolicyService(
    user: User,
) {
    if (!user) {
        throw new UnauthorizedError(
            "You need to be authorized",
        );
    }

    const policy =
        await prismaClient.leavePolicy.findUnique({
            where: {
                companyId: user.companyId,
            },
        });

    if (!policy) {
        throw new NotFoundError(
            "Leave policy not found.",
        );
    }

    return policy;
}


static async createPublicHolidayService(
    user: User,
    payload: CreatePublicHolidayInput,
) {
    if (!user || user.role !== "HR_ADMIN") {
        throw new UnauthorizedError(
            "You are not authorized.",
        );
    }

    // Prevent duplicate dates inside the request itself
    const duplicateDates = new Set<string>();

    for (const holiday of payload.holidays) {
        const key = holiday.date
            .toISOString()
            .split("T")[0];

        if (duplicateDates.has(key!)) {
            throw new ConflictError(
                `Duplicate holiday date detected: ${key}`,
            );
        }

        duplicateDates.add(key!);
    }

    // Prevent duplicate names inside the request
    const duplicateNames = new Set<string>();

    for (const holiday of payload.holidays) {
        const key = holiday.name
            .trim()
            .toLowerCase();

        if (duplicateNames.has(key)) {
            throw new ConflictError(
                `Duplicate holiday name detected: ${holiday.name}`,
            );
        }

        duplicateNames.add(key);
    }

    // Check against existing holidays
    const existing =
        await prismaClient.publicHoliday.findMany({
            where: {
                companyId: user.companyId,
                OR: [
                    {
                        name: {
                            in: payload.holidays.map((h) =>
                                h.name.trim(),
                            ),
                            mode: "insensitive",
                        },
                    },
                    {
                        date: {
                            in: payload.holidays.map(
                                (h ) => h.date,
                            ),
                        },
                    },
                ],
            },
        });

    if (existing.length > 0) {
        throw new ConflictError(
            "One or more public holidays already exist.",
        );
    }

    await prismaClient.publicHoliday.createMany({
        data: payload.holidays.map((holiday : any ) => ({
            companyId: user.companyId,
            name: holiday.name.trim(),
            date: holiday.date,
        })),
    });

    return {
        message:
            "Public holidays created successfully.",
        count: payload.holidays.length,
    };
}

static async updatePublicHolidayService(
  user: User,
  holidayId: string,
  payload: UpdatePublicHolidayInput,
) {
  if (!user || user.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You are not authorized.",
    );
  }

  const holiday =
    await prismaClient.publicHoliday.findFirst({
      where: {
        id: holidayId,
        companyId: user.companyId,
      },
    });

  if (!holiday) {
    throw new NotFoundError(
      "Public holiday not found.",
    );
  }

  const orConditions: Prisma.PublicHolidayWhereInput[] = [];

  if (payload.name) {
    orConditions.push({
      name: {
        equals: payload.name.trim(),
        // mode: Prisma.QueryMode.insensitive,
      },
    });
  }

  if (payload.date) {
    orConditions.push({
      date: payload.date,
    });
  }

  if (orConditions.length > 0) {
    const duplicate =
      await prismaClient.publicHoliday.findFirst({
        where: {
          companyId: user.companyId,
          id: {
            not: holiday.id,
          },
          OR: orConditions,
        },
      });

    if (duplicate) {
      throw new ConflictError(
        "Another public holiday already exists with this name or date.",
      );
    }
  }

  const updatedHoliday =
    await prismaClient.publicHoliday.update({
      where: {
        id: holiday.id,
      },
      data: {
        ...(payload.name && {
          name: payload.name.trim(),
        }),

        ...(payload.date && {
          date: payload.date,
        }),
      },
    });

  return updatedHoliday;
}

static async deletePublicHolidayService(
    user: User,
    holidayId: string,
) {
    if (!user || user.role !== "HR_ADMIN") {
        throw new UnauthorizedError(
            "You are not authorized.",
        );
    }

    const holiday =
        await prismaClient.publicHoliday.findFirst({
            where: {
                id: holidayId,
                companyId: user.companyId,
            },
        });

    if (!holiday) {
        throw new NotFoundError(
            "Public holiday not found.",
        );
    }

    await prismaClient.publicHoliday.delete({
        where: {
            id: holiday.id,
        },
    });

    return {
        message:
            "Public holiday deleted successfully.",
    };
}

  static async generatePresignedUrlApplicationService(
    user : User,
    payload: GetPresignedUrlInputForLeaveApplicationInput,
  ) {

    if (!user){
      throw new BadRequestError("You must be authorized")
    }

    const employee = await prismaClient.employee.findFirst({
      where : {
        companyId : user.companyId, 
        userId : user.userId
      }
    })
    if(!employee){
      throw new NotFoundError("Employee not found in company")
    }
    // generate unique storage key
    // const fileExtension = payload.fileName.split(".").pop();

    const safeFileName = payload.fileName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const storageKey = `leave_docs/${Date.now()}-${safeFileName}`;

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

  static async leaveApplicationSubmissionDocumentViewService(
    leaveRequestId: string,
    documentId: string,
    user: User,
  ) {
    if (!user ) {
      throw new UnauthorizedError("You need to be authorized");
    }
    const leaveRequest = await prismaClient.leaveRequest.findUnique({
      where : {
        id : leaveRequestId
      }
})
  if(!leaveRequest) {
    throw new NotFoundError("Leave request not found")
  }
const employee = await prismaClient.employee.findFirst({
    where : {
      companyId : user.companyId , id : leaveRequest.employeeId
    }
  })
  if(!employee){
    throw new NotFoundError("No employee found")
  }
  
  const department = await prismaClient.department.findFirst({
    where : {
       id : employee.departmentId!,
      companyId : user.companyId 
    }
  })
  if(!department){
    throw new NotFoundError("No department found")
  }
  const isHr = user.role === "HR_ADMIN"
  const isHod = user.userId === department.headEmployeeId
  const leaveOwner = user.userId === employee.userId

  if(!isHr || !isHod ||!leaveOwner){
    throw new BadRequestError("You are not authorized to view this")
  }

   const applicationDocument =
      await prismaClient.leaveRequestDocument.findFirst({
        where: {
          id: documentId,
          leaveId : leaveRequestId
        },
      });

    if (!applicationDocument) {
      throw new NotFoundError("Application document not found");
    }

    const documentViewUrl = await this.getPresignedDownloadUrl(
      applicationDocument.storageKey,
      60 * 15,
    );

    return {
      documentViewUrl,
      fileName: applicationDocument.fileName,
      mimeType: applicationDocument.mimeType,
    };

    

    
  }

  static async getPresignedDownloadUrl(storageKey: string, expiresIn = 900) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: storageKey,
    });

    return getSignedUrl(aws3Client, command, {
      expiresIn,
    });
  }

  static calculateLeaveDays(
    startDate: Date,
    endDate: Date,
    excludeWeekends: boolean,
    holidays: Date[],
  ) {
    let days = 0;

    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const isHoliday = holidays.some(
        (holiday) => holiday.toDateString() === current.toDateString(),
      );

      if ((!excludeWeekends || !isWeekend) && !isHoliday) {
        days++;
      }

      current.setDate(current.getDate() + 1);
    }

    return days;
  }
}
