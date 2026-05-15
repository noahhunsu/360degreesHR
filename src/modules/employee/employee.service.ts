// Creating new employee
// Get all employees
// Get specific employee
// update specific employee
// Delete specific employee

import { Role } from "../../../generated/prisma/enums.js";
import { prismaClient } from "../../config/db.js";

import type {
  CreateEmployeeInput,
  FilterQueryInput,
  UpdateEmployeeInput,
} from "./employee.validation.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import { sendEmail } from "../../shared/utils/sendEmail.js";
import type { User } from "../../../generated/prisma/client.js";
import { generateEmployeeCode } from "./employee.utils.js";
import { hashpassword } from "../../shared/utils/hash.js";
export class EmployeeService {
  static async createEmployeeService(
    payload: CreateEmployeeInput,
    hrUser: User,
  ) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: payload.email,companyId : hrUser.companyId
      },
    });

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // Check if manager exists or is a manager
    if (payload.managerId) {
      const manager = await prismaClient.employee.findFirst({
        where: {
          id: payload.managerId,
          companyId: hrUser.companyId,
        },

        include: {
          user: true,
        },
      });

      if (!manager) {
        throw new NotFoundError("Manager not found");
      }

      if (manager.user.role !== "MANAGER") {
        throw new ConflictError("Selected employee is not a manager");
      }
    }

    // Check if department exists
    if (payload.departmentId) {
      const department = await prismaClient.department.findFirst({
        where: {
          id: payload.departmentId,
          companyId: hrUser.companyId,
        },
      });

      if (!department) {
        throw new NotFoundError("Department not found");
      }
    }
    // to generate employeecode , we get the last employee from the database

    const lastEmployee = await prismaClient.employee.findFirst({
      where: {
        companyId: hrUser.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // THis is where we generate the employeeCode
    const employeeCode = generateEmployeeCode(
      lastEmployee?.employeeCode || null,
    );
    // we run a transaction . Creating both user and employee
    const result = await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: `${payload.firstName} ${payload.lastName}`,
          email: payload.email,
          password: payload.password,
          role: Role.EMPLOYEE,
          companyId: hrUser.companyId,
        },
      });
      const employeeData = {
        companyId: hrUser.companyId,
        employeeCode,
        firstName: payload.firstName,
        lastName: payload.lastName,
        gender: payload.gender,
        ...(payload.dateOfBirth && {
          dateOfBirth: new Date(payload.dateOfBirth),
        }),
        ...(payload.address && { address: payload.address }),
        ...(payload.jobTitle && { jobTitle: payload.jobTitle }),
        ...(payload.employmentType && {
          employmentType: payload.employmentType,
        }),
        ...(payload.managerId && { managerId: payload.managerId }),
        ...(payload.departmentId && { departmentId: payload.departmentId }),
        userId: user.id,
      };
      const employee = await tx.employee.create({
        data: employeeData,
      });

      return { user, employee };
    });

    try {
      await sendEmail({
        to: payload.email,
        subject: "Employee Onboarding",
        html: `
      <h2>Congratulations</h2>
      <p>Your have been successfully onboarded.</p>
      <p>Kindly use email and password you used for signing in.</p>
    `,
      });
    } catch (error) {
      console.error("Onboarding email failed:", error);
    }
    return result;
  }

  static async getAllEmployeeService(
    user: User,
    querySearch: FilterQueryInput,
  ) {
    if (!user) {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    const { page = 1, limit = 10, name } = querySearch;

    /**
     * Base query
     */
    const whereClause: any = {
      companyId: user.companyId,
      deletedAt: null,
    };

    /**
     * Role-based access control
     */
    if (user.role === "HR_ADMIN") {
      // HR can view everyone
    } else if (user.role === "MANAGER") {
      const managerEmployee = await prismaClient.employee.findFirst({
        where: {
          userId: user.id,
          companyId: user.companyId,
        },
      });

      if (!managerEmployee) {
        throw new UnauthorizedError("Manager profile not found");
      }

      whereClause.managerId = managerEmployee.id;
    } else if (user.role === "EMPLOYEE") {
      const employee = await prismaClient.employee.findFirst({
        where: {
          userId: user.id,
          companyId: user.companyId,
        },
      });

      if (!employee) {
        throw new UnauthorizedError("Employee profile not found");
      }

      whereClause.id = employee.id;
    } else {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * Search filters
     */
    if (name) {
      whereClause.OR = [
        {
          firstName: {
            contains: name,
            mode: "insensitive",
          },
        },

        {
          lastName: {
            contains: name,
            mode: "insensitive",
          },
        },
      ];
    }

    /**
     * Fetch employees
     */
    const employees = await prismaClient.employee.findMany({
      where: whereClause,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        department: true,

        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    /**
     * Total count for pagination
     */
    const total = await prismaClient.employee.count({
      where: whereClause,
    });

    return {
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSingleEmployeeService(user: User, employeeId: string) {
    if (!user) {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * Base query
     */
    const whereClause: any = {
      id: employeeId,
      companyId: user.companyId,
      deletedAt: null,
    };

    /**
     * HR_ADMIN
     * Can view anybody in company
     */
    if (user.role === "HR_ADMIN") {
      // no extra restriction
    } else if (user.role === "MANAGER") {
      /**
       * MANAGER
       * Can only view employees under them
       */
      const managerEmployee = await prismaClient.employee.findFirst({
        where: {
          userId: user.id,
          companyId: user.companyId,
        },
      });

      if (!managerEmployee) {
        throw new UnauthorizedError("Manager profile not found");
      }

      whereClause.managerId = managerEmployee.id;
    } else if (user.role === "EMPLOYEE") {
      /**
       * EMPLOYEE
       * Can only view themselves
       */
      const employee = await prismaClient.employee.findFirst({
        where: {
          userId: user.id,
          companyId: user.companyId,
        },
      });

      if (!employee) {
        throw new UnauthorizedError("Employee profile not found");
      }

      whereClause.id = employee.id;
    } else {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * Fetch employee
     */
    const employee = await prismaClient.employee.findFirst({
      where: whereClause,

      include: {
        department: true,

        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundError("Employee not found");
    }

    return employee;
  }


  static async updateEmployeeService(
    user: User,
    employeeId: string,
    payload: UpdateEmployeeInput,
  ) {
    /**
     * Authorization
     */
    if (!user || user.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * Check employee exists
     */
    const existingEmployee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
        deletedAt: null,
      },

      include: {
        user: true,
      },
    });

    if (!existingEmployee) {
      throw new NotFoundError("Employee not found");
    }

    /**
     * Email uniqueness check
     */
    if (payload.email && payload.email !== existingEmployee.user.email) {
      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: payload.email
        },
      });

      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
    }

    /**
     * Transaction
     */
    const employeeData: any = {};

    if (payload.firstName) {
      employeeData.firstName = payload.firstName;
    }

    if (payload.lastName) {
      employeeData.lastName = payload.lastName;
    }

    if (payload.gender) {
      employeeData.gender = payload.gender;
    }

    if (payload.dateOfBirth) {
      employeeData.dateOfBirth = new Date(payload.dateOfBirth);
    }

    if (payload.address) {
      employeeData.address = payload.address;
    }

    if (payload.jobTitle) {
      employeeData.jobTitle = payload.jobTitle;
    }

    if (payload.employmentType) {
      employeeData.employmentType = payload.employmentType;
    }

    if (payload.departmentId) {
      employeeData.departmentId = payload.departmentId;
    }

    if (payload.managerId) {
      employeeData.managerId = payload.managerId;
    }

    if (payload.employmentStatus) {
      employeeData.employmentStatus = payload.employmentStatus;
    }

    const userData: any = {};

    if (payload.email) {
      userData.email = payload.email;
    }

    if (payload.phone) {
      userData.phone = payload.phone;
    }

    if (payload.role) {
      userData.role = payload.role;
    }

    if (payload.password) {
      userData.password = await hashpassword(payload.password);
    }
    const result = await prismaClient.$transaction(async (tx) => {
      /**
       * Update user
       */
      const updatedUser = await tx.user.update({
        where: {
          id: existingEmployee.user.id,
        },

        data: userData,
      });

      /**
       * Update employee
       */

      const updatedEmployee = await tx.employee.update({
        where: {
          id: employeeId,
        },

        data: employeeData,

        include: {
          department: true,

          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },

          user: {
            select: {
              id: true,
              email: true,
              role: true,
              phone: true,
              isActive: true,
            },
          },
        },
      });

      return {
        employee: updatedEmployee,
        user: updatedUser,
      };
    });

    return result;
  }

  static async deleteEmployeeService(user: User, employeeId: string) {
    /**
     * Authorization
     */
    if (!user || user.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * Check employee exists
     */
    const existingEmployee = await prismaClient.employee.findFirst({
      where: {
        id: employeeId,
        companyId: user.companyId,
        deletedAt: null,
      },

      include: {
        user: true,
      },
    });

    if (!existingEmployee) {
      throw new NotFoundError("Employee not found");
    }

    /**
     * Prevent deleting self
     */
    if (existingEmployee.user.id === user.id) {
      throw new ConflictError("You cannot delete yourself");
    }

    /**
     * Soft delete transaction
     */
    await prismaClient.$transaction(async (tx) => {
      /**
       * Soft delete employee
       */
      await tx.employee.update({
        where: {
          id: employeeId,
        },

        data: {
          deletedAt: new Date(),
          employmentStatus: "TERMINATED",
        },
      });

      /**
       * Disable login access
       */
      await tx.user.update({
        where: {
          id: existingEmployee.user.id,
        },

        data: {
          isActive: false,
        },
      });
    });

    return {
      success: true,
      message: "Employee deleted successfully",
    };
  }
}
