// Creating new employee
// Get all employees
// Get specific employee
// update specific employee
// Delete specific employee

import { prismaClient } from "../../config/db.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../../generated/prisma/client.js";

import type { CreateDepartmentInput, UpdateDepartmentInput } from "./department.validation.js";
export class DepartmentService {
  static async createDepartmentService(
    payload: CreateDepartmentInput,
    hrUser: User,
  ) {
    const { name, description, parentDepartmentId, headEmployeeId } = payload;
    const parentId =
      typeof parentDepartmentId === "string" ? parentDepartmentId : null;

    const headId = typeof headEmployeeId === "string" ? headEmployeeId : null;
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    const existingDepartment = await prismaClient.department.findFirst({
      where: {
        companyId: hrUser.companyId,
        name: name,
      },
    });

    if (existingDepartment) {
      throw new ConflictError("Department already exists");
    }

    // Check parent department
    if (parentDepartmentId) {
      const parent = await prismaClient.department.findFirst({
        where: {
          parentDepartmentId,
          companyId: hrUser.companyId,
        },
      });

      if (!parent) {
        throw new NotFoundError("Department Not Found");
      }
    }

    // Next , we check the manager
    if (headEmployeeId) {
      const employee = await prismaClient.employee.findFirst({
        where: {
          id: headEmployeeId,
          companyId: hrUser.companyId,
        },
        include: {
          user: true,
        },
      });

      if (!employee) {
        throw new NotFoundError("Employee Not Found");
      }
      if (employee.user.role !== "MANAGER") {
        throw new ConflictError("Employee Must be a Manager");
      }
    }

    const department = await prismaClient.department.create({
      data: {
        companyId: hrUser.companyId,
        name,
        description,
        parentDepartmentId: parentId,
        headEmployeeId: headId,
      },
      include: {
        parentDepartment: true,
        headEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return department;
  }

 static async getDepartmentsService(hrUser: User) {
  /**
   * Authorization base check
   */
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  /**
   * Base company filter (multi-tenant safety)
   */
  const whereClause: any = {
    companyId: hrUser.companyId,
    deletedAt: null,
  };

  /**
   * MANAGER restriction
   * → only departments they head
   */
  if (hrUser.role === "MANAGER") {
    const managerEmployee = await prismaClient.employee.findFirst({
      where: {
        userId: hrUser.id,
        companyId: hrUser.companyId,
      },
    });

    if (!managerEmployee) {
      throw new UnauthorizedError("Manager profile not found");
    }

    whereClause.headEmployeeId = managerEmployee.id;
  }

  /**
   * HR_ADMIN → no extra filters
   */
  else if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError("You Are Not Authorized To Do This");
  }

  /**
   * Fetch departments
   */
  const departments = await prismaClient.department.findMany({
    where: whereClause,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      parentDepartment: {
        select: {
          id: true,
          name: true,
        },
      },

      headEmployee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      employees: {
        select: {
          id: true,
        },
      },
    },
  });

  /**
   * Transform response for frontend
   */
  return departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    status: dept.status,

    parentDepartment: dept.parentDepartment,
    headEmployee: dept.headEmployee,

    employeeCount: dept.employees.length,

    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  }));
}

static async getSingleDepartmentService(
  hrUser: User,
  departmentId: string,
) {
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  /**
   * Base department lookup (always company scoped)
   */
  const baseWhere: any = {
    id: departmentId,
    companyId: hrUser.companyId,
    deletedAt: null,
  };

  /**
   * MANAGER restriction
   * → only departments they head
   */
  if (hrUser.role === "MANAGER") {
    const managerEmployee = await prismaClient.employee.findFirst({
      where: {
        userId: hrUser.id,
        companyId: hrUser.companyId,
      },
    });

    if (!managerEmployee) {
      throw new UnauthorizedError("Manager profile not found");
    }

    baseWhere.headEmployeeId = managerEmployee.id;
  }

  /**
   * Only HR_ADMIN and MANAGER allowed
   */
  else if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError("You are not authorized to view this department");
  }

  /**
   * Fetch department
   */
  const department = await prismaClient.department.findFirst({
    where: baseWhere,

    include: {
      parentDepartment: {
        select: {
          id: true,
          name: true,
        },
      },

      subDepartments: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },

      headEmployee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!department) {
    throw new NotFoundError("Department not found");
  }

  return {
    id: department.id,
    name: department.name,
    description: department.description,
    status: department.status,

    parentDepartment: department.parentDepartment,
    subDepartments: department.subDepartments,

    headEmployee: department.headEmployee,

    employeeCount: department.employees.length,
    employees: department.employees,

    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
}
static async updateDepartmentService(
  hrUser: User,
  departmentId: string,
  payload: UpdateDepartmentInput
) {
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR_ADMIN can update departments"
    );
  }

  const department = await prismaClient.department.findFirst({
    where: {
      id: departmentId,
      companyId: hrUser.companyId,
      deletedAt: null,
    },
  });

  if (!department) {
    throw new NotFoundError("Department not found");
  }

  const updatedDepartment = await prismaClient.department.update({
    where: {
      id: departmentId,
    },

    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.description && { description: payload.description }),
      ...(payload.status && { status: payload.status }),
      ...(payload.parentDepartmentId !== undefined && {
        parentDepartmentId: payload.parentDepartmentId,
      }),
      ...(payload.headEmployeeId !== undefined && {
        headEmployeeId: payload.headEmployeeId,
      }),
    },

    include: {
      parentDepartment: true,
      headEmployee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      subDepartments: true,
    },
  });

  return updatedDepartment;
}

static async deleteDepartmentService(
  hrUser: User,
  departmentId: string,
) {
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError("Only HR_ADMIN can delete departments");
  }

  const department = await prismaClient.department.findFirst({
    where: {
      id: departmentId,
      companyId: hrUser.companyId,
      deletedAt: null,
    },
    include: {
      employees: true,
    },
  });

  if (!department) {
    throw new NotFoundError("Department not found");
  }

  /**
   * Block deletion if employees exist
   */
  if (department.employees.length > 0) {
    throw new ConflictError(
      "Cannot delete department with assigned employees"
    );
  }

  /**
   * Soft delete
   */
  const deletedDepartment = await prismaClient.department.update({
    where: {
      id: departmentId,
    },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE",
    },
  });

  return {
    message: "Department deleted successfully",
    department: deletedDepartment,
  };
}

static async getDepartmentTreeService(hrUser: User) {
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR_ADMIN can view department tree"
    );
  }

  /**
   * Fetch departments + employees in one go
   */
  const departments = await prismaClient.department.findMany({
    where: {
      companyId: hrUser.companyId,
      deletedAt: null,
    },
    include: {
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
        },
      },
    },
  });

  /**
   * Step 1: map departments by id
   */
  const map = new Map<string, any>();

  departments.forEach((dept) => {
    map.set(dept.id, {
      id: dept.id,
      name: dept.name,
      description: dept.description,
      status: dept.status,
      parentDepartmentId: dept.parentDepartmentId,
      employees: dept.employees,
      children: [],
    });
  });

  /**
   * Step 2: build tree
   */
  const tree: any[] = [];

  departments.forEach((dept) => {
    const node = map.get(dept.id);

    if (dept.parentDepartmentId) {
      const parent = map.get(dept.parentDepartmentId);

      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}
}
