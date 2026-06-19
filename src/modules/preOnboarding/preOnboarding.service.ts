// Creating new employee
// Get all employees
// Get specific employee
// update specific employee
// Delete specific employee

import { Role, type OnboardingStatus, type Prisma } from "@prisma/client";
import { prismaClient } from "../../config/db.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";
import type {
  CreateOnboardingInvitationInput,
  GetOnboardingInvitationInput,
  GetOnboardingSubmissionInput,
  GetPresignedUrlInputForPreOnboardingInput,
  OnboardingActionInput,
  SaveOnboardingSubmissionInput,
} from "./preOnboarding.validation.js";
import crypto from "crypto";
import { sendEmail } from "../../shared/utils/sendEmail.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { aws3Client } from "../../config/aws_s3.js";
import { EmployeeService } from "../employee/employee.service.js";
import {
  generateEmployeeCode,
  generateTemporaryPassword,
} from "../employee/employee.utils.js";
import type { CreateEmployeeInput } from "../employee/employee.validation.js";
import { hashpassword } from "../../shared/utils/hash.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class preOnboardingService {
  static async createOnboardingInvitationService(
    payload: CreateOnboardingInvitationInput,
    file: Express.Multer.File | undefined,
    hrUser: User,
  ) {
    // authorize user
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    // offer letter required
    if (!file) {
      throw new BadRequestError("Offer letter attachment is required");
    }

    // validate template
    const template = await prismaClient.onboardingTemplate.findFirst({
      where: {
        id: payload.templateId,

        companyId: hrUser.companyId,

        isActive: true,
      },

      include: {
        documentRequirements: true,
      },
    });

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    // validate department
    const department = await prismaClient.department.findFirst({
      where: {
        id: payload.departmentId,

        companyId: hrUser.companyId,

        status: "ACTIVE",
      },
    });

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    // prevent duplicate invitation
    const existingInvitation =
      await prismaClient.onboardingInvitation.findFirst({
        where: {
          email: payload.email.toLowerCase(),

          companyId: hrUser.companyId,

          invitationStatus: "PENDING",

          expiresAt: {
            gt: new Date(),
          },
        },
      });

    if (existingInvitation) {
      throw new ConflictError(
        "An active invitation already exists for this email",
      );
    }

    // validate manager
    if (payload.managerId) {
      const manager = await prismaClient.user.findFirst({
        where: {
          id: payload.managerId,

          companyId: hrUser.companyId,

          isActive: true,
        },
      });

      if (!manager) {
        throw new NotFoundError("Manager not found");
      }

      if (manager.role !== "MANAGER") {
        throw new UnauthorizedError("Selected user is not a manager");
      }
    }

    // onboarding token
    const token = crypto.randomBytes(32).toString("hex");

    // expiration
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + payload.expiresInDays);

    // snapshot requirements
    const requiredDocuments = template.documentRequirements.map((doc) => ({
      documentType: doc.documentType,

      isRequired: doc.isRequired,

      description: doc.description,
    }));

    // build invitation payload
    const invitationData: any = {
      companyId: hrUser.companyId,

      templateId: template.id,

      invitedById: hrUser.userId,

      departmentId: payload.departmentId,

      jobTitle: payload.jobTitle,

      email: payload.email.toLowerCase(),

      compensation: payload.compensation.toString(),

      employmentType: payload.employmentType,

      token,

      expiresAt,

      requiredDocuments,
    };

    if (payload.managerId) {
      invitationData.managerId = payload.managerId;
    }

    // transaction
    const result = await prismaClient.$transaction(async (tx) => {
      // create invitation
      const invitation = await tx.onboardingInvitation.create({
        data: invitationData,
      });

      // upload offer letter to s3
      const safeFileName = file.originalname
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const storageKey = `offer_letters/${hrUser.companyId}/${invitation.id}/${safeFileName}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,

        Key: storageKey,

        Body: file.buffer,

        ContentType: file.mimetype,
      });

      await aws3Client.send(uploadCommand);

      // create offer letter record
      const offerLetter = await tx.offerLetterDocument.create({
        data: {
          companyId: hrUser.companyId,

          invitationId: invitation.id,

          fileName: file.originalname,

          storageKey,

          mimeType: file.mimetype,

          fileSize: file.size,

          uploadedById: hrUser.userId,
        },
      });

      return {
        invitation,
        offerLetter,
      };
    });

    // onboarding link
    const onboardingLink = `${process.env.FRONTEND_URL}/onboarding?token=${token}`;

    // send invitation email
    try {
      const response = await sendEmail({
        to: payload.email,

        subject: "Employee Onboarding",

        html: `
          <h2>We'd love to have you on board.</h2>

          <p>
            Please find attached your offer letter.
          </p>

          <p>
            Kindly review and sign the offer letter.
          </p>

          <p>
            Once signed, click the onboarding link below and upload all required documents, including the signed offer letter.
          </p>

          <a href="${onboardingLink}">
            Employee Onboarding Link
          </a>
        `,

        attachments: [
          {
            filename: file.originalname,

            content: file.buffer,
          },
        ],
      });

      console.log("Invitation email sent:", response);
    } catch (error) {
      console.error("Onboarding email failed:", error);
    }

    return {
      message: "Invitation created and sent successfully",

      invitation: result.invitation,

      offerLetter: result.offerLetter,

      onboardingLink,
    };
  }

  static async getOnboardingInvitationService(token: string) {
    // find invitation
    console.log("currently here")
    const onboardingInvite = await prismaClient.onboardingInvitation.findUnique(
      {
        where: {
          token: token,
        },

        include: {
          template: true,

          submission: {
            include: {
              documents: true,
            },
          },

          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    );

    // invitation not found
    if (!onboardingInvite) {
      throw new NotFoundError("Invalid onboarding invitation");
    }

    // expired invitation
    if (onboardingInvite.expiresAt < new Date()) {
      // optional auto-expire update
      if (onboardingInvite.invitationStatus !== "EXPIRED") {
        await prismaClient.onboardingInvitation.update({
          where: {
            id: onboardingInvite.id,
          },

          data: {
            invitationStatus: "EXPIRED",
          },
        });
      }

      throw new BadRequestError("Invitation has expired");
    }

    // declined invitation
    if (onboardingInvite.invitationStatus === "DECLINED") {
      throw new BadRequestError("Invitation was declined");
    }

    // onboarding completed
    if (onboardingInvite.onboardingStatus === "COMPLETED") {
      throw new BadRequestError("Onboarding already completed");
    }

    return {
      message: "Invitation fetched successfully",

      invitation: onboardingInvite,
    };
  }

  static async saveOnboardingSubmissionService(
    payload: SaveOnboardingSubmissionInput,
  ) {
    // validate invitation
    const invitation = await prismaClient.onboardingInvitation.findFirst({
      where: {
        token: payload.token,
      },

      include: {
        submission: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundError("Invalid onboarding invitation");
    }

    if (invitation.submission?.status === "SUBMITTED" ||
      invitation.submission?.status === "APPROVED"||
      invitation.submission?.status === "COMPLETED"||
      invitation.submission?.status === "REJECTED"||
      invitation.submission?.status === "UNDER_REVIEW"

    ){
      throw new BadRequestError("Can't make changes to submission")
    }
    // check expiration
    if (invitation.expiresAt < new Date()) {
      await prismaClient.onboardingInvitation.update({
        where: {
          id: invitation.id,
        },

        data: {
          invitationStatus: "EXPIRED",
        },
      });

      throw new BadRequestError("Invitation has expired");
    }

    // prevent completed onboarding
    if (invitation.onboardingStatus === "COMPLETED") {
      throw new BadRequestError("Onboarding already completed");
    }

    console.log("ivitation " , invitation)
    // determine submission status
    let submissionStatus: OnboardingStatus = "IN_PROGRESS";

    let submittedAt: Date | null = null;

    // FINAL SUBMISSION
    if (!payload.isDraft) {
      // validate required fields
      if (!payload.firstName || !payload.lastName) {
        throw new BadRequestError("Required fields missing");
      }

      // validate required documents
      const requiredDocuments = invitation.requiredDocuments as any[];

      const uploadedDocumentTypes = payload.documents.map(
        (doc: any) => doc.documentType,
      );
      console.log('uploaded documentTypes' , uploadedDocumentTypes)

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

      submissionStatus = "SUBMITTED";

      submittedAt = new Date();
    }

    // transaction
    const result = await prismaClient.$transaction(async (tx) => {
      let submission;

      /**
       * CREATE SUBMISSION
       */
      if (!invitation.submission) {
        const createData: any = {
          invitationId: invitation.id,

          companyId: invitation.companyId,

          status: submissionStatus,

          submittedAt,

          departmentId: invitation.departmentId,

          jobTitle: invitation.jobTitle,
          gender : payload.gender
        };

        // optional fields
        if (payload.firstName) {
          createData.firstName = payload.firstName;
        }

        if (payload.lastName) {
          createData.lastName = payload.lastName;
        }

        if (payload.phoneNumber) {
          createData.phoneNumber = payload.phoneNumber;
        }

        if (payload.address) {
          createData.address = payload.address;
        }

        if (payload.dateOfBirth) {
          createData.dateOfBirth = payload.dateOfBirth;
        }

        if (payload.emergencyContactName) {
          createData.emergencyContactName = payload.emergencyContactName;
        }

        if (payload.emergencyContactPhone) {
          createData.emergencyContactPhone = payload.emergencyContactPhone;
        }

        submission = await tx.onboardingSubmission.create({
          data: createData,
        });
      } else {
        /**
         * UPDATE SUBMISSION
         */
        const updateData: any = {
          status: submissionStatus,

          submittedAt,
        };

        // important:
        // use !== undefined for updates

        if (payload.firstName !== undefined) {
          updateData.firstName = payload.firstName;
        }

        if (payload.lastName !== undefined) {
          updateData.lastName = payload.lastName;
        }

        if (payload.phoneNumber !== undefined) {
          updateData.phoneNumber = payload.phoneNumber;
        }

        if (payload.address !== undefined) {
          updateData.address = payload.address;
        }

        if (payload.dateOfBirth !== undefined) {
          updateData.dateOfBirth = payload.dateOfBirth;
        }

        if (payload.emergencyContactName !== undefined) {
          updateData.emergencyContactName = payload.emergencyContactName;
        }

        if (payload.emergencyContactPhone !== undefined) {
          updateData.emergencyContactPhone = payload.emergencyContactPhone;
        }

        submission = await tx.onboardingSubmission.update({
          where: {
            id: invitation.submission.id,
          },

          data: updateData,
        });

        // remove old documents
        await tx.onboardingDocument.deleteMany({
          where: {
            submissionId: submission.id,
          },
        });
      }

      /**
       * CREATE DOCUMENTS
       */
      if (payload.documents.length > 0) {
        await tx.onboardingDocument.createMany({
          data: payload.documents.map((doc) => ({
            submissionId: submission.id,

            documentType: doc.documentType,

            originalFileName: doc.originalFileName,

            storageKey: doc.storageKey,

            mimeType: doc.mimeType,

            fileSize: doc.fileSize,
          })),
        });
      }

      /**
       * UPDATE INVITATION
       */
      await tx.onboardingInvitation.update({
        where: {
          id: invitation.id,
        },

        data: {
          invitationStatus: "ACCEPTED",

          onboardingStatus: submissionStatus,

          acceptedAt: invitation.acceptedAt ?? new Date(),
        },
      });

      /**
       * FETCH UPDATED SUBMISSION
       */
      const updatedSubmission = await tx.onboardingSubmission.findFirst({
        where: {
          id: submission.id,
        },

        include: {
          documents: true,
        },
      });

      return updatedSubmission;
    });

    return {
      message: payload.isDraft
        ? "Draft saved successfully"
        : "Onboarding submitted successfully",

      submission: result,
    };
  }

  static async getOnboardingSubmissionService(hrUser: User) {
    /**
     * AUTHORIZE HR
     */
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    /**
     * FETCH SUBMISSIONS
     */
    const submissions = await prismaClient.onboardingSubmission.findMany({
      where: {
        companyId: hrUser.companyId,
      },

      include: {
        invitation: {
          select: {
            id: true,

            email: true,

            onboardingStatus: true,

            employmentType: true,

            compensation: true,

            jobTitle: true,

            createdAt: true,
          },
        },

        department: {
          select: {
            id: true,
            name: true,
          },
        },

        documents: {
          select: {
            id: true,
            documentType: true,
            reviewStatus: true,
            originalFileName: true,
            storageKey: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      message: "Submissions fetched successfully",

      submissions,
    };
  }

  static async getSingleOnboardingSubmissionService(
    hrUser: User,
    submissionId: string,
  ) {
    // Check if hr
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }
    // fetch single submission relating to company
    const submission = await prismaClient.onboardingSubmission.findFirst({
      where: {
        id: submissionId,
        companyId: hrUser.companyId,
      },
      include: {
        documents: true,
      },
    });

    if (!submission) {
      throw new NotFoundError("Submission not found");
    }
    return submission;
  }

  static async onboardingSubmissionActionService(
    submissionId: string,
    hrUser: User,
    payload: OnboardingActionInput,
  ) {
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }
    const submission = await prismaClient.onboardingSubmission.findFirst({
      where: {
        id: submissionId,
        companyId: hrUser.companyId,
      },
      include: {
        invitation: true,
        documents: true,
        department: true,
      },
    });

    if (!submission) {
      throw new BadRequestError("No Submission with ID found");
    }

    if (!submission.invitation) {
      throw new BadRequestError("No Invitation linked with this Submission");
    }

    const invitation = submission.invitation;

    /**
     * UNDER REVIEW
     */
    if (payload.status === "UNDER_REVIEW") {
      if (submission.status !== "SUBMITTED") {
        throw new BadRequestError("Only Submitted submissions can be reviewed");
      }
      const updatedSubmission = await prismaClient.onboardingSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: "UNDER_REVIEW",
          reviewedById: hrUser.userId,
          reviewedAt: new Date(),
        },
      });

      const updatedInvitation = await prismaClient.onboardingInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          onboardingStatus: "UNDER_REVIEW",
        },
      });
      return {
        message: "Submission updated successfully",
        submission,
      };
    }

    /**
     * REJECTED
     */

    if (payload.status === "REJECTED") {
      if (submission.status !== "UNDER_REVIEW") {
        throw new BadRequestError("Only Submitted submissions can be reviewed");
      }

      if (
        !payload.rejectionReason ||
        payload.rejectionReason.trim().length < 5
      ) {
        throw new BadRequestError("Rejection reason is required");
      }

      const updatedSubmission = await prismaClient.onboardingSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: "REJECTED",
          reviewedById: hrUser.userId,
          rejectionReason: payload.rejectionReason,
          reviewedAt: new Date(),
        },
      });
      const updatedInvitation = await prismaClient.onboardingInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          onboardingStatus: "REJECTED",
        },
      });
      return {
        message: "Submission rejected successfully",

        submission: updatedSubmission,
      };
    }

    /**
     * =====================================
     * APPROVE
     * =====================================
     */

    if (payload.status === "APPROVED") {
      if (submission.status !== "UNDER_REVIEW") {
        throw new BadRequestError(
          "Submission must be under review before approval",
        );
      }
      // Check if user exists already in system
      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: invitation.email,
        },
      });
      if (existingUser) {
        throw new ConflictError("User with email already exists");
      }
      // check if employee with email exists
      const existingEmployee = await prismaClient.employee.findFirst({
        where: {
          companyId: hrUser.companyId,
          user: {
            email: invitation.email,
          },
        },
      });
      if (existingEmployee) {
        throw new ConflictError("Employee with email already exists");
      }
      const employeeData = {
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: invitation.email,
        gender: submission.gender,
        dateOfBirth: submission.dateOfBirth ?? undefined,
        address: submission.address ?? undefined,
        jobTitle: invitation.jobTitle,
        employmentType: invitation.employmentType,
        managerId: invitation.managerId ?? undefined,
        departmentId: invitation.departmentId ?? undefined,
        hiredDate: new Date(),
      };
      const employee = await EmployeeService.createEmployeeService(
        employeeData,
        hrUser,
      );

      const updatedSubmission = await prismaClient.onboardingSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: "APPROVED",
          reviewedById: hrUser.userId,
          reviewedAt: new Date(),
        },
      });

      const updatedInvitation = await prismaClient.onboardingInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          onboardingStatus: "APPROVED",
        },
      });

      return {
        message: "Submission approved successfully",

        employee,

        submission: updatedSubmission,
      };
    }
  }

  static async onboardingSubmissionDocumentViewService(
    submissionId : string , documentId : string , hrUser : User 
  ){
    if (!hrUser || hrUser.role !== "HR_ADMIN"){
      throw new UnauthorizedError("You need to be authorized")
    }

    const onboardingDocument = await prismaClient.onboardingDocument.findFirst({
      where : {
        id : documentId , 
        submissionId 
      }
    })

    if (!onboardingDocument){
      throw new NotFoundError("Onboarding document not found")
    }

    const documentViewUrl = await this.getPresignedDownloadUrl(onboardingDocument.storageKey , 60 * 15)

    return {
      documentViewUrl, 
      fileName : onboardingDocument.originalFileName , 
      mimeType : onboardingDocument.mimeType

    }
  }

  static async getPresignedDownloadUrl(storageKey: string , expiresIn = 900) {
    const command = new GetObjectCommand({
      Bucket : process.env.AWS_BUCKET_NAME,
      Key : storageKey
    });

    return getSignedUrl(aws3Client , command ,{
      expiresIn
    })
  }


   static async generatePresignedUrlPreOnboardingService(
      payload: GetPresignedUrlInputForPreOnboardingInput,
    ) {
  
      // generate unique storage key
      // const fileExtension = payload.fileName.split(".").pop();
     console.log("payload is " , payload)
  
      const safeFileName = payload.fileName
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");
      const storageKey = `pre_onboarding_docs/${Date.now()}-${safeFileName}`;
  
      // create upload command
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        
  
        Key: storageKey,
  
        ContentType: payload.mimeType,
      });
  
      // generate signed url
      const uploadUrl = await getSignedUrl(aws3Client, command, {
        expiresIn: 60 * 5
      });
  
      // This returned upload url is then used by frontend to do a put request
  
      return {
        message: "Upload URL generated successfully",
  
        uploadUrl,
  
        storageKey,
  
        expiresIn: 300,
      };
    }
}
