

import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type { AcceptOrRejectRequisitionInput, CreateJobRequisitionInput, UpdateJobRequisitionInput } from "./jobRequisitions.validation.js";



export class JobRequisitionService {
static async createJobRequisitionService(
  payload: CreateJobRequisitionInput,
  user: User,
) {
  if (!user) {
    throw new UnauthorizedError(
      "You are not authorized",
    );
  }

  // HR Admin can create requisitions immediately
  if (user.role !== "HR_ADMIN") {

    const isManager =
      user.role === "MANAGER";

    if (!isManager) {

      // Check if employee record exists
      const employee =
        await prismaClient.employee.findFirst({
          where: {
            userId: user.userId,
            companyId: user.companyId,
          },
        });

      if (!employee) {
        throw new UnauthorizedError(
          "You are unauthorized to perform this action",
        );
      }

      // Check if employee is department head
      const department =
        await prismaClient.department.findFirst({
          where: {
            companyId: user.companyId,
            headEmployeeId: employee.id,
          },
        });

      if (!department) {
        throw new UnauthorizedError(
          "Only HR admins, managers or department heads can create requisitions",
        );
      }

      // Department heads can only create for their own department
      if (
        department.id !==
        payload.departmentId
      ) {
        throw new UnauthorizedError(
          "You cannot create requisitions for another department",
        );
      }
    }
  }

  const targetDepartment =
    await prismaClient.department.findFirst({
      where: {
        id: payload.departmentId,
        companyId: user.companyId,
      },
    });

  if (!targetDepartment) {
    throw new NotFoundError(
      "Department not found",
    );
  }

  // Check if a requisition has been created for this job title 

  const existingPendingRequisition = await prismaClient.jobRequisition.findFirst({
    where : {
      companyId : user.companyId , 
      jobTitle : payload.jobTitle.trim() , 
      departmentId : payload.departmentId, 
      status : "PENDING"
    }
  })

  if(existingPendingRequisition){
    throw new ConflictError("Requisition exists for department")
  }

  const jobRequisition =
    await prismaClient.jobRequisition.create({
      data: {
        companyId: user.companyId,

        requestedById: user.userId,

        departmentId: payload.departmentId,

        jobTitle: payload.jobTitle,

        numberOfPositions:
          payload.numberOfPositions,

        salaryRangeMin:
          payload.salaryRangeMin,

        salaryRangeMax:
          payload.salaryRangeMax,

        reason: payload.reason,

        priority: payload.priority,
      },
    });

  return jobRequisition;
}

static async getAllRequisitionService(
  user : User
){

  if (!user){
    throw new UnauthorizedError("You need to be authenticated");
  }

  const whereClause : any = {
    companyId : user.companyId
  }
  if (user.role !== "HR_ADMIN") {

    whereClause.requestedById = user.userId
  }

 const requisitions =
  await prismaClient.jobRequisition.findMany({
    where: whereClause,

    include: {
      department: true,

      requestedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvedOrRejectedBy : {
        select : {
          id : true , 
          name : true , 
          email : true
        }
      }
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return requisitions
}

static async getSingleRequisitionService(
  requisitionId : string , 
  user : User
){
  if (!user){
    throw new UnauthorizedError("You need to be authorized to perform this action")
  }

  const whereClause : any = {
    companyId : user.companyId
  }
  if(user.role !== "HR_ADMIN") {
    
    whereClause.requestedById = user.userId
  }
  const requisition = await prismaClient.jobRequisition.findFirst({
    where : {
      id : requisitionId,
      ...whereClause 
    }, 
    include : {
      department : true , 
      requestedBy : true , 
      approvedOrRejectedBy : true
    }
  })

  if(!requisition){
    throw new NotFoundError("No requisition found")
  }

  return requisition
}


static async updateJobRequisitionService(
  requisitionId : string,
  payload: UpdateJobRequisitionInput,
  user: User,
) {

  if (!user) {
    throw new UnauthorizedError(
      "You are not authorized",
    );
  }

  const requisition = await prismaClient.jobRequisition.findFirst({
    where : {
      id: requisitionId,
      companyId : user.companyId , 
    }
  })

  if(!requisition){
    throw new NotFoundError("No requisition found for user")
  }
  if(user.role !== "HR_ADMIN" && requisition.requestedById !== user.userId){
    throw new UnauthorizedError("Only Hr or requisition creator can update this requisition")
  }
  
  if (requisition.status !== "PENDING"){
    throw new ConflictError("Only pending requisitions can be updated")

  }
  const updatedRequisition = await prismaClient.jobRequisition.update({
    where : {
      id : requisition.id,
    } , 
    data : {
      ...(payload.jobTitle && {
          jobTitle: payload.jobTitle,
        }),

        ...(payload.numberOfPositions && {
          numberOfPositions:
            payload.numberOfPositions,
        }),

        ...(payload.salaryRangeMin && {
          salaryRangeMin:
            payload.salaryRangeMin,
        }),

        ...(payload.salaryRangeMax && {
          salaryRangeMax:
            payload.salaryRangeMax,
        }),

        ...(payload.reason && {
          reason: payload.reason,
        }),

        ...(payload.priority && {
          priority: payload.priority,
        }),
    }
  })


  return updatedRequisition;
}

static async cancelJobRequisitionService(
  requisitionId : string,
  user: User,
) {

  if (!user) {
    throw new UnauthorizedError(
      "You are not authorized",
    );
  }

  const requisition = await prismaClient.jobRequisition.findFirst({
    where : {
      id: requisitionId,
      companyId : user.companyId , 
    }
  })

  if(!requisition){
    throw new NotFoundError("No requisition found for user")
  }
  if(user.role !== "HR_ADMIN" && requisition.requestedById !== user.userId){
    throw new UnauthorizedError("Only Hr or requisition creator can update this requisition")
  }
  
  if (requisition.status !== "PENDING"){
    throw new ConflictError("Only pending requisitions can be updated")

  }
  const cancelledRequisition = await prismaClient.jobRequisition.update({
    where : {
      id : requisition.id,
    } , 
    data : {
      status : "CANCELLED"

       
    }
  })


  return cancelledRequisition;
}

static async acceptOrRejectRequisitionService(
  requisitionId : string , 
  hrUser : User , 
  payload : AcceptOrRejectRequisitionInput
){

  if (!hrUser || hrUser.role !== "HR_ADMIN"){
    throw new UnauthorizedError("You are not authorized to perform this action")
  }
  const requisition = await prismaClient.jobRequisition.findFirst({
    where : {
      id : requisitionId,
      companyId : hrUser.companyId , 
      status : "PENDING"
    }, 
    include: {
    requestedBy: true,
    department: true,
  }
  })

  if(!requisition){
    throw new NotFoundError("No Pending requisition found")
  }
  if (payload.isRejected){
    if(!payload.rejectionReason){
      throw new BadRequestError("Rejection Reason should be stated")
    }
    return await prismaClient.jobRequisition.update({
      where : {
        id : requisition.id
      } ,
      data : {
        status : "REJECTED" , 
        rejectionReason : payload.rejectionReason, 
        approvedOrRejectedById : hrUser.userId,
        reviewedAt : new Date()
      }
    })
  }else{
     return await prismaClient.jobRequisition.update({
      where : {
        id : requisition.id
      } ,
      data : {
        status : "APPROVED" , 
        approvedOrRejectedById : hrUser.userId,
        reviewedAt : new Date()
      }
    })
  }

}

static async getJobRequisitionStatsService(
  user: User,
) {
  if (!user) {
    throw new UnauthorizedError(
      "You are not authenticated",
    );
  }

  const whereClause: any = {
    companyId: user.companyId,
  };

  // Non-HR users only see their own requisitions
  if (user.role !== "HR_ADMIN") {
    whereClause.requestedById =
      user.userId;
  }

  const [
    total,
    pending,
    approved,
    rejected,
    cancelled,
  ] = await Promise.all([
    prismaClient.jobRequisition.count({
      where: whereClause,
    }),

    prismaClient.jobRequisition.count({
      where: {
        ...whereClause,
        status: "PENDING",
      },
    }),

    prismaClient.jobRequisition.count({
      where: {
        ...whereClause,
        status: "APPROVED",
      },
    }),

    prismaClient.jobRequisition.count({
      where: {
        ...whereClause,
        status: "REJECTED",
      },
    }),

    prismaClient.jobRequisition.count({
      where: {
        ...whereClause,
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    cancelled,
  };
}
}
