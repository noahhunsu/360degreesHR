

export interface TokenContent {
    userId : string ,
    role : string , 
    companyId : string , 
    expiresIn : string
}

export const allowedFields = [
  "firstName",
  "password",
  "lastName",
  "email",
  "phone",
  "gender",
  "dateOfBirth",
  "address",
  "jobTitle",
  "employmentType",
  "departmentId",
  "managerId",
  "hireDate",
];