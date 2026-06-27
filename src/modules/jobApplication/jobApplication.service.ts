import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../config/db.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";

import type { User } from "../../shared/types/global.types.js";
import type {
  CreateJobApplicationInput,
  GetPresignedUrlInputForApplicationInput,
  MoveJobApplicationInput,
  RejectJobApplicationInput,
} from "./jobApplication.validation.js";
import { aws3Client } from "../../config/aws_s3.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { GetPresignedUrlInputForApplication } from "../jobCreation/jobCreation.validation.js";

export class JobApplicationService {
  static async createJobApplicationService(
    payload: CreateJobApplicationInput,
    jobOpeningId: string,
  ) {
    const jobOpening = await prismaClient.jobOpening.findUnique({
      where: {
        id: jobOpeningId,
      },
      include: {
        jobOpeningSettings: {
          include: {
            jobOpeningDocuments: true,
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
      throw new NotFoundError("No such opening exists ");
    }

    // Check if candidate has applied for role before
    const existingCandidate = await prismaClient.candidate.findFirst({
      where: {
        email: payload.email,
        companyId: jobOpening.companyId,
      },
    });
    if (existingCandidate) {
      const application = await prismaClient.jobApplication.findFirst({
        where: {
          candidateId: existingCandidate.id,
          jobOpeningId: jobOpening.id,
          companyId: jobOpening.companyId,
        },
      });

      if (application) {
        throw new ConflictError("You already applied for this position");
      }
    }
    // Check if all the document requirements were supplied by candidate

    // validate required documents
    const requiredDocuments = jobOpening.jobOpeningSettings
      ?.jobOpeningDocuments as any[];

    const uploadedDocumentTypes = payload.documents.map(
      (doc: any) => doc.documentType,
    );
    console.log("uploaded documentTypes", uploadedDocumentTypes);

    const missingDocuments = requiredDocuments.filter(
      (doc) =>
        doc.isRequired && !uploadedDocumentTypes.includes(doc.documentType),
    );

    if (missingDocuments.length > 0) {
      throw new BadRequestError(
        `Missing required documents: ${missingDocuments
          .map((doc) => doc.documentType)
          .join(", ")}`,
      );
    }

    const currentStage = jobOpening.jobOpeningSettings?.stages[0];

    if (!currentStage) {
      throw new BadRequestError("Job opening has no hiring stages configured");
    }
    // Create Candidate
    const transaction = await prismaClient.$transaction(async (tx) => {
      let candidate = existingCandidate;

      // Create candidate only if candidate does not exist
      if (!candidate) {
        candidate = await tx.candidate.create({
          data: {
            companyId: jobOpening.companyId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            ...(payload.phoneNumber && {
              phone: payload.phoneNumber,
            }),
          },
        });
      } else {
        candidate = await tx.candidate.update({
          where: {
            id: candidate.id,
          },
          data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            ...(payload.phoneNumber && {
              phone: payload.phoneNumber,
            }),
          },
        });
      }

      const application = await tx.jobApplication.create({
        data: {
          candidateId: candidate.id,
          companyId: jobOpening.companyId,
          jobOpeningId: jobOpening.id,
          currentStageId: currentStage.id,
        },
      });

      await tx.jobApplicationDocument.createMany({
        data: payload.documents.map((doc) => ({
          jobApplicationId: application.id,
          documentType: doc.documentType,
          fileName: doc.fileName,
          storageKey: doc.storageKey,
          mimeType: doc.mimeType,
        })),
      });
      return candidate;
    });
    return transaction;
  }

  static async getAllJobApplicationService(user: User) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    // HR can see everything
    if (user.role === "HR_ADMIN") {
      return prismaClient.jobApplication.findMany({
        where: {
          companyId: user.companyId,
        },
        include: {
          candidate: true,
          jobOpening: true,
          currentStage: true,
          documents: true, // adjust relation name if different
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Check if user belongs to any hiring team
    const hiringAssignments = await prismaClient.jobOpeningHiringTeam.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        jobOpeningSettings: {
          select: {
            jobOpeningId: true,
          },
        },
      },
    });

    const jobOpeningIds = hiringAssignments.map(
      (assignment) => assignment.jobOpeningSettings.jobOpeningId,
    );

    if (jobOpeningIds.length === 0) {
      throw new UnauthorizedError("You are not assigned to any hiring team");
    }

    return prismaClient.jobApplication.findMany({
      where: {
        companyId: user.companyId,
        jobOpeningId: {
          in: jobOpeningIds,
        },
      },
      include: {
        candidate: true,
        jobOpening: true,
        currentStage: true,
        documents: true, // adjust relation name if different
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  static async getSingleJobApplicationService(
    user: User,
    applicationId: string,
  ) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    const application = await prismaClient.jobApplication.findFirst({
      where: {
        id: applicationId,
        companyId: user.companyId,
      },
      include: {
        candidate: true,

        jobOpening: {
          include: {
            department: true,
          },
        },

        currentStage: true,

        documents: true,
      },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // HR can see any application
    if (user.role === "HR_ADMIN") {
      return application;
    }

    // Verify user belongs to hiring team for this opening
    const hiringAssignment = await prismaClient.jobOpeningHiringTeam.findFirst({
      where: {
        userId: user.userId,

        jobOpeningSettings: {
          jobOpeningId: application.jobOpeningId,
        },
      },
    });

    if (!hiringAssignment) {
      throw new UnauthorizedError(
        "You are not authorized to view this application",
      );
    }

    return application;
  }
  static async moveJobApplicationService(
    user: User,
    payload: MoveJobApplicationInput,
  ) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    const jobApplication = await prismaClient.jobApplication.findFirst({
      where: {
        id: payload.applicationId,
        companyId: user.companyId,
      },
      include: {
        currentStage: true,
        jobOpening: {
          include: {
            jobOpeningSettings: {
              include: {
                stages: {
                  orderBy: {
                    position: "asc",
                  },
                },
                hiringTeam: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!jobApplication) {
      throw new NotFoundError("Job Application Not Found");
    }

    if (jobApplication.status !== "ACTIVE") {
      throw new BadRequestError("Only active applications can be moved");
    }
    let authorized = user.role === "HR_ADMIN";

    if (!authorized) {
      const hiringManager =
        jobApplication.jobOpening.jobOpeningSettings?.hiringTeam.find(
          (member) =>
            member.userId === user.userId && member.role === "HIRING_MANAGER",
        );

      authorized = !!hiringManager;
    }
    if (!authorized) {
      throw new UnauthorizedError(
        "Only admins or hiring managers can perform this action",
      );
    }

    const targetStage =
      jobApplication.jobOpening.jobOpeningSettings?.stages.find(
        (stage) => stage.id === payload.stageId,
      );

    if (!targetStage) {
      throw new BadRequestError("This stage is not in the hiring pipeline");
    }

    const currentStageId = jobApplication.currentStageId;

    return prismaClient.$transaction(async (tx) => {
      const updatedApplication = await tx.jobApplication.update({
        where: {
          id: jobApplication.id,
        },
        data: {
          currentStageId: targetStage.id,
        },
        include: {
          candidate: true,
          currentStage: true,
        },
      });
      await tx.applicationStageHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStageId: currentStageId,
          toStageId: targetStage.id,
          movedById: user.userId,
          ...(payload.notes && { notes: payload.notes }),
        },
      });
      return updatedApplication;
    });
  }
  
  static async rejectJobApplicationService(
    user: User,
    payload: RejectJobApplicationInput,
  ) {
    if (!user) {
      throw new UnauthorizedError("You need to be authorized");
    }

    const application = await prismaClient.jobApplication.findFirst({
      where: {
        id: payload.applicationId,
        companyId: user.companyId,
      },

      include: {
        candidate: true,

        jobOpening: {
          include: {
            jobOpeningSettings: {
              include: {
                hiringTeam: true,
              },
            },
          },
        },

        currentStage: true,
      },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    let authorized = false;

    // HR can reject
    if (user.role === "HR_ADMIN") {
      authorized = true;
    }

    // Hiring manager can reject
    if (user.role !== "HR_ADMIN") {
      const hiringManager =
        application.jobOpening.jobOpeningSettings?.hiringTeam.find(
          (member) =>
            member.userId === user.userId && member.role === "HIRING_MANAGER",
        );

      if (hiringManager) {
        authorized = true;
      }
    }

    if (!authorized) {
      throw new UnauthorizedError(
        "You are not authorized to reject this application",
      );
    }

    if (application.status === "REJECTED") {
      throw new ConflictError("Application has already been rejected");
    }

    if (application.status === "HIRED") {
      throw new ConflictError("A hired application cannot be rejected");
    }

    return prismaClient.$transaction(async (tx) => {
      const rejectedApplication = await tx.jobApplication.update({
        where: {
          id: application.id,
        },

        data: {
          status: "REJECTED",
          rejectedById: user.userId,
          rejectionReason: payload.reason,
        },
      });

      return rejectedApplication;
    });
  }

  static async generatePresignedUrlApplicationService(
    payload: GetPresignedUrlInputForApplicationInput,
  ) {
    // generate unique storage key
    // const fileExtension = payload.fileName.split(".").pop();

    const safeFileName = payload.fileName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const storageKey = `applications_docs/${Date.now()}-${safeFileName}`;

    // create upload command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,

      Key: storageKey,

      ContentType: payload.mimeType,
    });

    // generate signed url
    const uploadUrl = await getSignedUrl(aws3Client, command, {
      expiresIn: 60 * 5,
    });

    // This returned upload url is then used by frontend to do a put request

    return {
      message: "Upload URL generated successfully",

      uploadUrl,

      storageKey,

      expiresIn: 300,
    };
  }

  static async applicationSubmissionDocumentViewService(
    applicationId: string,
    documentId: string,
    user: User,
  ) {
    if (!user ) {
      throw new UnauthorizedError("You need to be authorized");
    }

    const application = await prismaClient.jobApplication.findFirst({
      where: {
        id: applicationId,
        companyId: user.companyId,
      },

      include: {
        candidate: true,

        jobOpening: {
          include: {
            jobOpeningSettings: {
              include: {
                hiringTeam: true,
              },
            },
          },
        },

        currentStage: true,
      },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }
    let authorized = false;

    // HR can Preview
    if (user.role === "HR_ADMIN") {
      authorized = true;
    }

    // Hiring manager can Preview
    if (user.role !== "HR_ADMIN") {
      const hiringManager =
        application.jobOpening.jobOpeningSettings?.hiringTeam.find(
          (member) =>
            member.userId === user.userId && member.role === "HIRING_MANAGER",
        );

      if (hiringManager) {
        authorized = true;
      }
    }

    if (!authorized) {
      throw new UnauthorizedError(
        "You are not authorized to reject this application",
      );
    }
    const applicationDocument =
      await prismaClient.jobApplicationDocument.findFirst({
        where: {
          id: documentId,
          jobApplicationId: applicationId,
        },
      });

    if (!applicationDocument) {
      throw new NotFoundError("Application document not found");
    }

    const documentViewUrl = await this.getPresignedDownloadUrl(
      applicationDocument.storageKey,
      60 * 15,
    );

    return {
      documentViewUrl,
      fileName: applicationDocument.fileName,
      mimeType: applicationDocument.mimeType,
    };
  }

  static async getPresignedDownloadUrl(storageKey: string, expiresIn = 900) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: storageKey,
    });

    return getSignedUrl(aws3Client, command, {
      expiresIn,
    });
  }
}
