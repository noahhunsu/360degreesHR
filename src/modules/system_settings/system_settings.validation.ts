import * as z from "zod";

export const createRoleSchema = z.object({
  name : z.string(), 
  description : z.string().optional(), 

});
export const updateRoleSchema = z.object({
  name : z.string().optional(), 
  description : z.string().optional(), 

});
export const permissionToRoleSchema = z.object({
  permissions : z.array(z.string())

});


export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
