import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "360Degrees HR API",
      version: "1.0.0",
      description: "API documentation for 360Degrees HR Platform",
    },

    servers: [
      {
        url: "https://three60degreeshr-iewp.onrender.com/api/v1",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        // Auth schema
        RegisterRequest: {
          type: "object",
          required: [
            "companyName",
            "companyEmail",
            "adminName",
            "adminEmail",
            "password",
          ],

          properties: {
            companyName: {
              type: "string",
              example: "360Degrees HR",
            },

            companyEmail: {
              type: "string",
              format: "email",
              example: "info@360degrees.com",
            },

            companyAddress: {
              type: "string",
              example: "Abuja, Nigeria",
            },

            companyPhone: {
              type: "string",
              example: "+2348012345678",
            },

            firstName: {
              type: "string",
              example: "Arthur",
            },
            lastName: {
              type: "string",
              example: "Arthur",
            },
            gender: {
              type: "string",
              example: "MALE",
            },

            adminEmail: {
              type: "string",
              format: "email",
              example: "arthur@360degrees.com",
            },

            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123",
            },
          },
        },

        RegisterResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Company Registration Successful",
            },

            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "jwt.token.here",
                },

                user: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },

                    name: {
                      type: "string",
                    },

                    email: {
                      type: "string",
                    },

                    role: {
                      type: "string",
                      example: "HR_ADMIN",
                    },
                  },
                },
                company: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                    },

                    name: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },

        LoginRequest: {
          type: "object",

          required: ["userEmail", "password"],

          properties: {
            userEmail: {
              type: "string",
              format: "email",
              example: "arthur@360degrees.com",
            },

            password: {
              type: "string",
              format: "password",
              example: "SecurePass123",
            },
          },
        },

        LoginResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Login Successful",
            },

            data: {
              type: "object",

              properties: {
                token: {
                  type: "string",
                  example: "jwt.token.here",
                },

                user: {
                  type: "object",

                  properties: {
                    userId: {
                      type: "string",
                    },

                    role: {
                      type: "string",
                      example: "HR_ADMIN",
                    },

                    companyId: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
        AuthMeResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "User fetched successfully",
            },

            data: {
              type: "object",

              properties: {
                userId: {
                  type: "string",
                },
                name: {
                  type: "string",
                },

                email: {
                  type: "string",
                },

                role: {
                  type: "string",
                  example: "HR_ADMIN",
                },

                companyId: {
                  type: "string",
                },
              },
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",

          required: ["email"],

          properties: {
            email: {
              type: "string",
              format: "email",
              example: "arthur@360degrees.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",

          required: ["password"],

          properties: {
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "NewSecurePassword123",
            },
          },
        },
        GenericSuccessResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },

        // Employee part
        CreateEmployeeRequest: {
          type: "object",

          required: ["firstName", "lastName", "email", "password", "gender"],

          properties: {
            firstName: {
              type: "string",
              minLength: 2,
              example: "John",
            },

            lastName: {
              type: "string",
              minLength: 2,
              example: "Doe",
            },

            email: {
              type: "string",
              format: "email",
              example: "john.doe@360degrees.com",
            },

            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123",
            },

            phone: {
              type: "string",
              example: "+2348012345678",
            },

            gender: {
              type: "string",
              enum: ["MALE", "FEMALE"],
              example: "MALE",
            },

            dateOfBirth: {
              type: "string",
              format: "date-time",
              example: "1998-05-20T00:00:00.000Z",
            },

            address: {
              type: "string",
              example: "Lagos, Nigeria",
            },

            jobTitle: {
              type: "string",
              example: "Backend Engineer",
            },

            employmentType: {
              type: "string",
              enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "REMOTE"],
              example: "FULL_TIME",
            },

            departmentId: {
              type: "string",
              format: "uuid",
              example: "7e1f9d42-8c5e-4c5f-91e1-73ffbcb7db31",
            },

            managerId: {
              type: "string",
              format: "uuid",
              example: "df84cbb0-50f7-4d74-a7d3-f2d26e4f315d",
            },

            hireDate: {
              type: "string",
              format: "date-time",
              example: "2026-05-13T00:00:00.000Z",
            },
          },
        },

        CreateEmployeeResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: true,
            },

            message: {
              type: "string",
              example: "Employee Created successfully",
            },

            data: {
              type: "object",

              properties: {
                user: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },

                    name: {
                      type: "string",
                      example: "John Doe",
                    },

                    email: {
                      type: "string",
                      format: "email",
                    },

                    role: {
                      type: "string",
                      example: "EMPLOYEE",
                    },
                  },
                },

                employee: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },

                    employeeCode: {
                      type: "string",
                      example: "EMP-0001",
                    },

                    firstName: {
                      type: "string",
                      example: "John",
                    },

                    lastName: {
                      type: "string",
                      example: "Doe",
                    },

                    employmentStatus: {
                      type: "string",
                      example: "ACTIVE",
                    },

                    companyId: {
                      type: "string",
                      format: "uuid",
                    },

                    departmentId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                    },

                    managerId: {
                      type: "string",
                      format: "uuid",
                      nullable: true,
                    },

                    createdAt: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },

        // Getting all employees 
        GetAllEmployeesResponse: {
  type: "object",

  properties: {

    success: {
      type: "boolean",
      example: true,
    },

    message: {
      type: "string",
      example: "Employees gotten successfully",
    },

    data: {
      type: "object",

      properties: {

        employees: {
          type: "array",

          items: {

            type: "object",

            properties: {

              id: {
                type: "string",
                format: "uuid",
              },

              employeeCode: {
                type: "string",
                example: "EMP-0001",
              },

              firstName: {
                type: "string",
                example: "John",
              },

              lastName: {
                type: "string",
                example: "Doe",
              },

              gender: {
                type: "string",
                example: "MALE",
              },

              employmentStatus: {
                type: "string",
                example: "ACTIVE",
              },

              jobTitle: {
                type: "string",
                example: "Backend Engineer",
              },

              createdAt: {
                type: "string",
                format: "date-time",
              },

              department: {

                type: "object",

                nullable: true,

                properties: {

                  id: {
                    type: "string",
                    format: "uuid",
                  },

                  name: {
                    type: "string",
                    example: "Engineering",
                  },
                },
              },

              manager: {

                type: "object",

                nullable: true,

                properties: {

                  id: {
                    type: "string",
                    format: "uuid",
                  },

                  firstName: {
                    type: "string",
                    example: "Arthur",
                  },

                  lastName: {
                    type: "string",
                    example: "Chima",
                  },
                },
              },

              user: {

                type: "object",

                properties: {

                  id: {
                    type: "string",
                    format: "uuid",
                  },

                  email: {
                    type: "string",
                    format: "email",
                  },

                  role: {
                    type: "string",
                    example: "EMPLOYEE",
                  },

                  isActive: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },

        pagination: {

          type: "object",

          properties: {

            total: {
              type: "integer",
              example: 50,
            },

            page: {
              type: "integer",
              example: 1,
            },

            limit: {
              type: "integer",
              example: 10,
            },

            totalPages: {
              type: "integer",
              example: 5,
            },
          },
        },
      },
    },
  },
},
      },
    },
  },

  apis: ["src/modules/**/*.ts", "src/modules/**/*.docs.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
