import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type {
  CreateJobOpeningInput,
  UpdateJobOpeningInput,
} from "./jobCreation.validation.js";

export class JobOpeningCreationService {
  static async createJobOpeningService(
    payload: CreateJobOpeningInput,
    hrUser: User,
  ) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action",
      );
    }

    const requisition = await prismaClient.jobRequisition.findFirst({
      where: {
        id: payload.requisitionId,
        companyId: hrUser.companyId,
      },
    });

    if (!requisition) {
      throw new NotFoundError("Requisition not found");
    }

    if (requisition.status !== "APPROVED") {
      throw new BadRequestError("Requisitions must be approved");
    }

    // Check if an opening already exists for this requisition
    const existingOpening = await prismaClient.jobOpening.findUnique({
      where: {
        requisitionId: requisition.id,
      },
    });

    if (existingOpening) {
      throw new ConflictError(
        "A job opening already exists for this requisition",
      );
    }

    // We'd check if the hiring team exist in the company.

    const users = await prismaClient.user.findMany({
      where: {
        id: {
          in: payload.hiringTeam.map((member) => member.userId),
        },
        companyId: hrUser.companyId,
      },
      select: {
        id: true,
      },
    });

    if (users.length !== payload.hiringTeam.length) {
      throw new BadRequestError("One or more hiring team members are invalid");
    }
    // First thing is to create the job opening . All these must be done withing a transaction

    const createJobOpening = await prismaClient.$transaction(async (tx) => {
      const jobOpening = await tx.jobOpening.create({
        data: {
          companyId: hrUser.companyId,
          requisitionId: requisition.id,
          departmentId: requisition.departmentId,
          title: payload.title,
          description: payload.description,
          ...(payload.location && { location: payload.location }),
          employmentType: payload.employmentType,
          ...(payload.salaryMax !== undefined && {
            salaryMax: payload.salaryMax,
          }),
          ...(payload.salaryMin !== undefined && {
            salaryMin: payload.salaryMin,
          }),
          status:  "DRAFT" 
        },
      });

      const jobOpeningSettings = await tx.jobOpeningSettings.create({
        data: {
          jobOpeningId: jobOpening.id,
          numberOfOpenings: payload.settings.numberOfOpenings,
          ...(payload.settings.openingDate && {
            openingDate: payload.settings.openingDate,
          }),
          ...(payload.settings.expiryDate && {
            expiryDate: payload.settings.expiryDate,
          }),
          evaluationScale: payload.settings.evaluationScale,
        },
      });
      await tx.jobOpeningHiringTeam.createMany({
        data: payload.hiringTeam.map((hiringTeam) => ({
          jobOpeningSettingsId: jobOpeningSettings.id,
          userId: hiringTeam.userId,
          role: hiringTeam.role,
        })),
      });
      await tx.jobOpeningHiringTeam.createMany({
        data: payload.hiringTeam.map((hiringTeam) => ({
          jobOpeningSettingsId: jobOpeningSettings.id,
          userId: hiringTeam.userId,
          role: hiringTeam.role,
        })),
      });

      await tx.jobOpeningDocumentRequirement.createMany({
        data : payload.jobOpeningDocuments.map((doc)=>({
          name : doc.name , 
          isRequired : doc.isRequired , 
          jobOpeningSettingsId : jobOpeningSettings.id
        }))
      })
      
      await tx.jobOpeningHiringStage.createMany({
        data: payload.stages.map((stage) => ({
          settingsId: jobOpeningSettings.id,
          name: stage.name,
          position: stage.position,
          isRequired: stage.isRequired,
        })),
      });

      return {
        jobOpening,
      };
    });

    return createJobOpening;
  }

  static async getAllJobOpeningService(hrUser : User) {

    if(!hrUser || hrUser.role !== "HR_ADMIN"){
      throw new UnauthorizedError("You are unauthorized")
    }
    let companyId = hrUser.companyId
    return prismaClient.jobOpening.findMany({
      where: {
        companyId,
      },

      include: {
        department: true,

        requisition: {
          select: {
            id: true,
            jobTitle: true,
            priority: true,
          },
        },

        jobOpeningSettings: {
          include: {
            hiringTeam: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },

            stages: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
  static async getSingleJobOpeningService(
    hrUser : User,
    openingId: string,
  ) {

    if (!hrUser || hrUser.role !== "HR_ADMIN"){
      throw new UnauthorizedError("You need to be authorized to do this")
    }

    let companyId = hrUser.companyId; 

    const jobOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id: openingId,
        companyId,
      },

      include: {
        department: true,

        requisition: true,

        jobOpeningSettings: {
          include: {
            hiringTeam: {
              include: {
                user: true,
              },
            },

            stages: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (!jobOpening) {
      throw new NotFoundError("Job opening not found");
    }

    return jobOpening;
  }

  static async updateJobOpeningService(
    openingId: string,
    payload: UpdateJobOpeningInput,
    hrUser: User,
  ) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action",
      );
    }

    const existingOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id: openingId,
        companyId: hrUser.companyId,
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    if (!existingOpening) {
      throw new NotFoundError("Job opening not found");
    }

    if (existingOpening.status === "CLOSED") {
      throw new ConflictError("Closed job openings cannot be updated");
    }

    if (existingOpening.status !== "DRAFT") {
      throw new ConflictError("Only draft job openings can be updated");
    }
    if (payload.hiringTeam?.length && payload.hiringTeam.length > 0) {
      const users = await prismaClient.user.findMany({
        where: {
          id: {
            in: payload.hiringTeam.map((member) => member.userId),
          },
          companyId: hrUser.companyId,
        },
        select: {
          id: true,
        },
      });

      if (users.length !== payload.hiringTeam.length) {
        throw new BadRequestError(
          "One or more hiring team members are invalid",
        );
      }
    }

    const effectiveOpeningDate =
      payload.settings?.openingDate ??
      existingOpening.jobOpeningSettings?.openingDate;

    const effectiveExpiryDate =
      payload.settings?.expiryDate ??
      existingOpening.jobOpeningSettings?.expiryDate;

    if (
      effectiveOpeningDate &&
      effectiveExpiryDate &&
      effectiveExpiryDate < effectiveOpeningDate
    ) {
      throw new BadRequestError("Expiry date cannot be before opening date");
    }
    return prismaClient.$transaction(async (tx) => {
      // update opening
      const updatedOpening = await tx.jobOpening.update({
        where: {
          id: existingOpening.id,
        },

        data: {
          ...(payload.title && {
            title: payload.title,
          }),

          ...(payload.description && {
            description: payload.description,
          }),

          ...(payload.location && {
            location: payload.location,
          }),

          ...(payload.employmentType && {
            employmentType: payload.employmentType,
          }),

          ...(payload.salaryMin !== undefined && {
            salaryMin: payload.salaryMin,
          }),
          ...(payload.salaryMax !== undefined && {
            salaryMax: payload.salaryMax,
          }),
        },
      });

      // update settings
      const updatedSettings = await tx.jobOpeningSettings.update({
        where: {
          jobOpeningId: existingOpening.id,
        },

        data: {
          ...(payload.settings?.numberOfOpenings !== undefined && {
            numberOfOpenings: payload.settings.numberOfOpenings,
          }),

          ...(payload.settings?.expiryDate !== undefined && {
            expiryDate: payload.settings.expiryDate,
          }),

          ...(payload.settings?.openingDate !== undefined && {
            openingDate: payload.settings.openingDate,
          }),

          ...(payload.settings?.evaluationScale !== undefined && {
            evaluationScale: payload.settings.evaluationScale,
          }),
        },
      });

      // replace hiring team
      if (payload.hiringTeam && payload.hiringTeam.length > 0) {
        await tx.jobOpeningHiringTeam.deleteMany({
          where: {
            jobOpeningSettingsId: updatedSettings.id,
          },
        });

        await tx.jobOpeningHiringTeam.createMany({
          data: payload.hiringTeam.map((member) => ({
            jobOpeningSettingsId: updatedSettings.id,

            userId: member.userId,

            role: member.role,
          })),
        });
      }

      // replace stages
      if (payload.stages && payload.stages.length > 0) {
        await tx.jobOpeningHiringStage.deleteMany({
          where: {
            settingsId: updatedSettings.id,
          },
        });

        await tx.jobOpeningHiringStage.createMany({
          data: payload.stages.map((stage) => ({
            settingsId: updatedSettings.id,

            name: stage.name,

            position: stage.position,

            isRequired: stage.isRequired,
          })),
        });
      }
      if (payload.jobOpeningDocuments && payload.jobOpeningDocuments.length > 0) {
        await tx.jobOpeningDocumentRequirement.deleteMany({
          where: {
            jobOpeningSettingsId: updatedSettings.id,
          },
        });

        await tx.jobOpeningDocumentRequirement.createMany({
          data: payload.jobOpeningDocuments.map((doc) => ({
            jobOpeningSettingsId: updatedSettings.id,

            name: doc.name,
            isRequired: doc.isRequired,
          })),
        });
      }

      return tx.jobOpening.findUnique({
        where: {
          id: existingOpening.id,
        },

        include: {
          department: true,

          requisition: true,

          jobOpeningSettings: {
            include: {
              hiringTeam: {
                include: {
                  user: true,
                },
              },
              jobOpeningDocuments : true,
              stages: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },
      });
    });
  }

  static async publishJobOpeningService(openingId: string, hrUser: User) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action",
      );
    }

    const existingOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id: openingId,
        companyId: hrUser.companyId,
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    if (!existingOpening) {
      throw new NotFoundError("Job opening not found");
    }

    if (existingOpening.status === "CLOSED") {
      throw new ConflictError("Closed job openings cannot be updated");
    }

    if (existingOpening.status !== "DRAFT") {
      throw new ConflictError("Only draft job openings can be published");
    }

    const jobOpeningSettings = await prismaClient.jobOpeningSettings.findFirst({
      where: {
        jobOpeningId: existingOpening.id,
      },
      include: {
        hiringTeam: true,
        stages: true,
      },
    });

    if (!jobOpeningSettings) {
      throw new BadRequestError("Job Settings must be applied");
    }
    if (jobOpeningSettings.hiringTeam.length == 0) {
      throw new BadRequestError("Hiring team cannot be empty");
    }
    if (jobOpeningSettings.stages.length == 0) {
      throw new BadRequestError("Stages cannot be empty");
    }
    const publishedJobOpening = await prismaClient.jobOpening.update({
      where: {
        id: existingOpening.id,
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    return publishedJobOpening;
  }
  static async closeJobOpeningService(openingId: string, hrUser: User) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action",
      );
    }

    const existingOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id: openingId,
        companyId: hrUser.companyId,
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    if (!existingOpening) {
      throw new NotFoundError("Job opening not found");
    }

    if (existingOpening.status === "CLOSED") {
      throw new ConflictError("Job opening already closed");
    }

    if (existingOpening.status !== "PUBLISHED") {
      throw new ConflictError("Only Published job openings can be closed");
    }

    const closedJobOpening = await prismaClient.jobOpening.update({
      where: {
        id: existingOpening.id,
      },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });

    return closedJobOpening;
  }

  static async reOpenJobOpeningService(openingId: string, hrUser: User) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action",
      );
    }

    const existingOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id: openingId,
        companyId: hrUser.companyId,
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    if (!existingOpening) {
      throw new NotFoundError("Job opening not found");
    }

    if (existingOpening.status !== "CLOSED") {
      throw new ConflictError("Only closed positions can be reopend");
    }

    const reOpenedJobOpening = await prismaClient.jobOpening.update({
      where: {
        id: existingOpening.id,
      },
      data: {
        status: "DRAFT",
        closedAt: null,
        publishedAt : null
      },
    });

    return reOpenedJobOpening;
  }

  static async getPublishedJobOpeningService(companyId: string) {
    const existingOpenings = await prismaClient.jobOpening.findMany({
      where: {
        companyId,
        status: "PUBLISHED",
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    return existingOpenings;
  }

  static async getSinglePublishedJobOpeningService(companyId: string , jobOpeningId : string) {
    const existingOpening = await prismaClient.jobOpening.findFirst({
      where: {
        id : jobOpeningId ,
        companyId,
        status: "PUBLISHED",
      },

      include: {
        jobOpeningSettings: true,
      },
    });

    if (!existingOpening) {
  throw new NotFoundError(
    "Published job opening not found"
  );
}
    return existingOpening;
  }

  static async getJobOpeningStats(hrUser: User) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You need to be authorized");
    }

    let companyId = hrUser.companyId;
    const [total, draft, published, closed] = await Promise.all([
      prismaClient.jobOpening.count({
        where: { companyId },
      }),

      prismaClient.jobOpening.count({
        where: {
          companyId,
          status: "DRAFT",
        },
      }),

      prismaClient.jobOpening.count({
        where: {
          companyId,
          status: "PUBLISHED",
        },
      }),

      prismaClient.jobOpening.count({
        where: {
          companyId,
          status: "CLOSED",
        },
      }),
    ]);

    return {
      total,
      draft,
      published,
      closed,
    };
  }
}
