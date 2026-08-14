import { prismaClient } from "../../config/db.js"
import { NotFoundError } from "../../shared/exceptions/app.error.js"
import type { User } from "../../shared/types/global.types.js"


export const checkPermissionExists = async(permissions : string[]) =>{

    for (const permission of permissions) {
        const perm = await prismaClient.permission.findFirst({
            where : {
                id : permission
            }
        })

        if (!perm) {
            throw new NotFoundError("Permission not found")
        }
    }
    return 
}

export const assignPermissionUtils = async (roleId : string , permissions : string[])=>{
    for (const permission of permissions) {
        const rolePermission = await prismaClient.rolePermission.create({
            data : {
                roleId , 
                permissionId : permission
            }
        })
    }

    return 
}
export const checkRoleInCompany = async (user : User ,roleId : string )=>{
   const role = await prismaClient.companyRole.findFirst({
      where : {
        companyId : user.companyId , 
        id : roleId
      }
    })

    if(!role) {
      throw new NotFoundError("Role not found ")
    } 

    return role
}