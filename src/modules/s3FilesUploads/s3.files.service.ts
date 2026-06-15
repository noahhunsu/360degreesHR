import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../config/db.js";
import {
  allowedMimeTypes,
  type GetPresignedUrlForOfferInput,
  type GetPresignedUrlInput,
} from "./s3.files.validation.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import { aws3Client } from "../../config/aws_s3.js";

export class S3FilesService {
  static async generatePresignedUrlForOnboardingService(
    payload: GetPresignedUrlInput,
  ) {
    // Check token exists

    const invitation = await prismaClient.onboardingInvitation.findFirst({
      where: {
        token: payload.token,
      },
    });

    if (!invitation) {
      throw new NotFoundError("Invitation not found");
    }

    // expired
    if (invitation.expiresAt < new Date()) {
      throw new BadRequestError("Invitation expired");
    }

    // validate mime type
    if (!allowedMimeTypes.includes(payload.mimeType)) {
      throw new BadRequestError("Unsupported file type");
    }

    // validate required document type
    const requiredDocuments = invitation.requiredDocuments as any[];

    const validDocument = requiredDocuments.find(
      (doc) => doc.documentType === payload.documentType,
    );

    if (!validDocument) {
      throw new BadRequestError("Invalid document type");
    }

    // generate unique storage key
    const fileExtension = payload.fileName.split(".").pop();

    const storageKey = `onboarding_docs/${invitation.companyId}/${invitation.id}/${Date.now()}-${payload.documentType}.${fileExtension}`;

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

    return {
      message: "Upload URL generated successfully",

      uploadUrl,

      storageKey,

      expiresIn: 300,
    };
  }
  
}
