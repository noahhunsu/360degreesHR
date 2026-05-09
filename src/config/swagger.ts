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
        url: "http://localhost:5000/api/v1",
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

            adminName: {
              type: "string",
              example: "Arthur",
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
                type : "object" , 
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
      },
    },

 
  },

  apis: ["src/modules/**/*.ts", "src/modules/**/*.docs.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
