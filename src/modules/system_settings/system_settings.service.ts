import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../shared/exceptions/app.error.js";
import type {
  CreateRoleInput,
  UpdateRoleInput,
} from "./system_settings.validation.js";
import type { User } from "../../shared/types/global.types.js";
import {
  assignPermissionUtils,
  checkPermissionExists,
  checkRoleInCompany,
} from "./system_settings.utils.js";
import { checkUserInCompany } from "../../utils/global.utils.js";
export class SystemSettingsService {
  static async createRoleService(user: User, payload: CreateRoleInput) {
    const roleName = payload.name.trim().toLowerCase();
    const role = await prismaClient.companyRole.findFirst({
      where: {
        name: roleName,
        companyId: user.companyId,
      },
    });

    if (role) {
      throw new ConflictError("A role with a similar name exists");
    }

    let newRole = await prismaClient.companyRole.create({
      data: {
        companyId: user.companyId,
        name: roleName,
        ...(payload.description && { description: payload.description }),
      },
    });

    return { newRole };
  }

  static async getAllRoleService(user: User) {
    return await prismaClient.companyRole.findMany({
      where: {
        companyId: user.companyId,
      },
    });
  }
  static async getSingleRoleService(user: User, roleId: string) {
    const role = await checkRoleInCompany(user, roleId);

    const permissionsInRole = await prismaClient.rolePermission.findMany({
      where: {
        roleId: role.id,
      },
      include: {
        permission: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return {
      role,
      permissions: permissionsInRole.map((item) => item.permission),
    };
  }

  static async updateSingleRoleService(
    user: User,
    roleId: string,
    payload: UpdateRoleInput,
  ) {
    let role = await checkRoleInCompany(user, roleId);
    if (role.name === "system_admin") {
      throw new BadRequestError("Sorry , you can't edit 'system_admin' role");
    }

    const updatedRole = await prismaClient.companyRole.update({
      where: {
        id: roleId,
      },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.description && { description: payload.description }),
      },
    });

    return updatedRole;
  }
  static async deleteRoleService(user: User, roleId: string) {
    let role = await checkRoleInCompany(user, roleId);

    if (role.name === "system_admin") {
      throw new BadRequestError("Sorry , you can't edit 'system_admin' role");
    }

    const deletedRole = await prismaClient.companyRole.delete({
      where: {
        id: roleId,
      },
    });

    return deletedRole;
  }

  static async assignPermissionsToRoleService(
    user: User,
    roleId: string,
    permissions: string[],
  ) {
    await checkRoleInCompany(user, roleId);

    await checkPermissionExists(permissions);

    await assignPermissionUtils(roleId, permissions);

    return;
  }
  static async updatePermissionsToRoleService(
    user: User,
    roleId: string,
    permissions: string[],
  ) {
    let role = await checkRoleInCompany(user, roleId);

    if (role.name === "system_admin".toLowerCase()) {
      throw new BadRequestError("Sorry , You can't edit system_admin role");
    }

    await checkPermissionExists(permissions);

    await assignPermissionUtils(roleId, permissions);

    return;
  }

  static async assignRoleToUserService(user: User, roleId: string, to: string) {
    // if (user.userId === to) {
    //   throw new BadRequestError("You can't assign a role to your self");
    // }

    await checkUserInCompany(user, to);
    await checkRoleInCompany(user, roleId);

    const userRole = await prismaClient.userRole.create({
      data: {
        userId: to,
        roleId,
      },
    });

    return userRole;
  }

  static async deleteRoleInUserService(
    user: User,
    roleId: string,
    userId: string,
  ) {
    await checkUserInCompany(user, userId);

    await checkRoleInCompany(user, roleId);
    const userRole = await prismaClient.userRole.findFirst({
      where: {
        userId,
        roleId,
      },
    });

    if (!userRole) {
      throw new NotFoundError("No role in user");
    }

    const deleteRole = await prismaClient.userRole.delete({
      where: {
        id: userRole.id,
      },
    });

    return deleteRole;
  }
  static async getAllRolesInUserService(user: User, userId: string) {
    await checkUserInCompany(user, userId);
    const userRoles = await prismaClient.userRole.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return userRoles;
  }
  static async getSingleRolesInUserService(
    user: User,
    roleId: string,
    userId: string,
  ) {
    await checkUserInCompany(user, userId);
    await checkRoleInCompany(user, roleId);
    const userRoles = await prismaClient.userRole.findFirst({
      where: {
        userId,
        roleId,
      },
      include: {
        user: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return userRoles;
  }
}
