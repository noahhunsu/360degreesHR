

export interface User {
    userId: string,
      companyId: string,
      role: string,
}
export interface AuthorizationContext {
      userId: string,
      companyId: string,
      permissions : string[]
}