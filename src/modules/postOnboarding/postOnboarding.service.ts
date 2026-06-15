

import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type { CreateOnboardingTaskInput, CreateOnboardingTaskTemplateInput,  } from "./postOnboarding.validation.js";



export class postOnboardingService {
static async createOnboardingTaskTemplateService(
  payload: CreateOnboardingTaskTemplateInput,
  hrUser: User
) {
  if (!hrUser) {
    throw new UnauthorizedError(
      "You are not authorized"
    );
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR Admin can create onboarding task templates"
    );
  }

  const existingTemplate =
    await prismaClient.onboardingTaskTemplate.findFirst({
      where: {
        companyId: hrUser.companyId,
        title: payload.title,
        isActive: true,
      },
    });

  if (existingTemplate) {
    throw new ConflictError(
      "A template with this title already exists"
    );
  }

  if (
    payload.responsibility === "SPECIFIC_USER" && payload.assignedUserId
  ) {
    const assignedUser =
      await prismaClient.user.findFirst({
        where: {
          id: payload.assignedUserId ,
          companyId: hrUser.companyId,
          isActive: true,
        },
      });

    if (!assignedUser) {
      throw new NotFoundError(
        "Assigned user not found"
      );
    }
  }

  const template =
    await prismaClient.onboardingTaskTemplate.create({
      data: {
        companyId: hrUser.companyId,

        title: payload.title,

        description:
          payload.description ?? null,

        responsibility:
          payload.responsibility,

        assignedUserId:
          payload.assignedUserId ?? null,

        createdById:
          hrUser.userId,
      },
    });

  return {
    message:
      "Task template created successfully",

    template,
  };
}
static async getOnboardingTaskTemplatesService(
  hrUser: User
) {
  if (!hrUser) {
    throw new UnauthorizedError(
      "You are not authorized"
    );
  }

  const templates =
    await prismaClient.onboardingTaskTemplate.findMany({
      where: {
        companyId: hrUser.companyId,
        isActive: true,
      },

      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return templates;
}
static async deactivateOnboardingTaskTemplateService(
  templateId: string,
  hrUser: User
) {
  const template =
    await prismaClient.onboardingTaskTemplate.findFirst({
      where: {
        id: templateId,
        companyId: hrUser.companyId,
      },
    });

  if (!template) {
    throw new NotFoundError(
      "Template not found"
    );
  }

  await prismaClient.onboardingTaskTemplate.update({
    where: {
      id: template.id,
    },

    data: {
      isActive: false,
    },
  });

  return {
    message:
      "Template deactivated successfully",
  };
}
static async createOnboardingTaskService(
  employeeId: string,
  hrUser: User,
  payload: CreateOnboardingTaskInput
) {

  if (!hrUser) {
    throw new UnauthorizedError(
      "You are not authorized"
    );
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR admins can create onboarding tasks"
    );
  }

  const template =
    await prismaClient.onboardingTaskTemplate.findFirst({
      where: {
        id: payload.onboardingTaskTemplateId,
        companyId: hrUser.companyId,
        isActive: true,
      },
    });

  if (!template) {
    throw new NotFoundError(
      "Task template not found"
    );
  }

  const employee =
    await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: hrUser.companyId,
      },
    });

  if (!employee) {
    throw new NotFoundError(
      "Employee not found"
    );
  }

  let assignedToUserId: string;

  /**
   * HR
   */
  if (template.responsibility === "HR") {

    assignedToUserId = hrUser.userId;

  }

  /**
   * SPECIFIC USER
   */
  else if (
    template.responsibility === "SPECIFIC_USER"
  ) {

    if (!template.assignedUserId) {
      throw new BadRequestError(
        "Template has no assigned user"
      );
    }

    assignedToUserId =
      template.assignedUserId;

  }

  /**
   * DEPARTMENT MANAGER
   */
  else {

    if (!employee.departmentId) {
      throw new BadRequestError(
        "Employee does not belong to a department"
      );
    }

    const department =
      await prismaClient.department.findFirst({
        where: {
          id: employee.departmentId,
          companyId: hrUser.companyId,
        },

        include: {
          headEmployee: {
            include: {
              user: true,
            },
          },
        },
      });

    if (!department) {
      throw new NotFoundError(
        "Department not found"
      );
    }

    if (!department.headEmployee) {
      throw new BadRequestError(
        "Department has no manager assigned"
      );
    }

    assignedToUserId =
      department.headEmployee.userId;
  }

  const onboardingTask =
    await prismaClient.employeeOnboardingTask.create({
      data: {
        companyId: hrUser.companyId,

        employeeId: employee.id,

        templateId: template.id,

        title: template.title,

        description:
          template.description,

        assignedToUserId,

        status: "PENDING",
      },
    });

  return {
    message:
      "Onboarding task created successfully",

    onboardingTask,
  };
}
static async getMyOnboardingTaskService(
  currentUser: User
) {
  if (!currentUser) {
    throw new UnauthorizedError(
      "You are not authenticated"
    );
  }

  const onboardingTasks =
    await prismaClient.employeeOnboardingTask.findMany({
      where: {
        assignedToUserId: currentUser.userId,
      },

      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            jobTitle: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return {
    onboardingTasks,
  };
}
static async startMyOnboardingTaskService(
  taskId : string, 
  currentUser: User
) {
  console.log("in start")
  if (!currentUser) {
    throw new UnauthorizedError(
      "You are not authenticated"
    );
  }
  // Get the task with the id 

  const task = await prismaClient.employeeOnboardingTask.findFirst({
    where : {
      id : taskId, companyId : currentUser.companyId
    }
  })

  if(!task){
    throw new BadRequestError("No task with ID Found")
  }
  if (task.assignedToUserId !== currentUser.userId){
    throw new UnauthorizedError("You are not permitted to perform this action ")
  }

  if(task.status === "COMPLETED"){
    throw new BadRequestError("Task Already Completed")
  }
  if(task.status === "IN_PROGRESS"){
    throw new BadRequestError("Task Already Started")
  }
  const updatedOnboardingTasks =
    await prismaClient.employeeOnboardingTask.update({
      where: {
        id: taskId,

      },
      data : {
        status : "IN_PROGRESS", 
        startedAt : new Date()
      }
     
    });

  return {
    message : "Task updated successfully",
    task : updatedOnboardingTasks,
  };
}
static async completeMyOnboardingTaskService(
  taskId : string, 
  currentUser: User
) {
  console.log("In complete")
  if (!currentUser) {
    throw new UnauthorizedError(
      "You are not authenticated"
    );
  }
  // Get the task with the id 

  const task = await prismaClient.employeeOnboardingTask.findFirst({
    where : {
      id : taskId, companyId : currentUser.companyId
    }
  })

  if(!task){
    throw new BadRequestError("No task with ID Found")
  }
  if (task.assignedToUserId !== currentUser.userId){
    throw new UnauthorizedError("You are not permitted to perform this action ")
  }

  if(task.status === "COMPLETED"){
    throw new BadRequestError("Task Already Completed")
  }
  if (task.status === "PENDING") {
  throw new BadRequestError(
    "Task must be started before completion"
  );
}
  const completedOnboardingTasks =
    await prismaClient.employeeOnboardingTask.update({
      where: {
        id: taskId,

      },
      data : {
        status : "COMPLETED", 
        completedAt : new Date(),
        completedById : currentUser.userId
      }
     
    });

  return {
    message : "Task completed successfully",
    task : completedOnboardingTasks,
  };
}

static async getIncompleteOnboardingTaskService(
  user: User,
  employeeId: string
) {

  if (!user) {
    throw new UnauthorizedError(
      "You are not authenticated"
    );
  }

  if (user.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR admins can perform this action"
    );
  }

  const employee =
    await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeCode: true,
      },
    });

  if (!employee) {
    throw new NotFoundError(
      "Employee not found"
    );
  }

const incompleteTasks =
  await prismaClient.employeeOnboardingTask.findMany({
    where: {
      employeeId,
      companyId: user.companyId,
      status: {
        not: "COMPLETED",
      },
    },

    select: {
      id: true,
      title: true,
      status: true,

      assignedToUser: {
        select: {
          id: true,
          name: true,
        },
      },

    
    },
  });

  return {
    employee,
    incompleteTasks,
  };
}
}
