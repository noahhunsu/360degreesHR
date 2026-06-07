

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

  export const templateSampleData = [
    {
      firstName: "John",

      lastName: "Doe",

      email: "john@example.com",

      gender: "MALE",

      phone: "+2348012345678",

      address: "Lagos",

      jobTitle: "Software Engineer",

      employmentType: "FULL_TIME",
      hireDate: "2026-05-01",
    },
  ];