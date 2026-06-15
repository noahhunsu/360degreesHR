import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../config/db.js";
import {
  type GetPresignedUrlForOfferInput,
  type OfferLetterTemplateInput,
} from "./offer_letter.validation.js";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import { aws3Client } from "../../config/aws_s3.js";
import type { User } from "../../shared/types/global.types.js";

export class OfferLetterService {

  static async generatePresignedUrlOfferLetterTemplateService(
    hrUser: User,
    payload: GetPresignedUrlForOfferInput,
  ) {
    // Check token exists
    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }
    
    // generate unique storage key
    const fileExtension = payload.fileName.split(".").pop();
    console.log("file extension")

    if (fileExtension?.toLocaleLowerCase() !== "docx") {
      throw new BadRequestError("File format not accepted");
    }

    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(payload.mimeType)) {
      throw new BadRequestError("Invalid file type");
    }

    const safeFileName = payload.fileName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const storageKey = `offer_letter_templates/${hrUser.companyId}/${Date.now()}-${safeFileName}`;

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
  static async generatePresignedUrlForEmployeeOfferService(
    hrUser: User,
    payload: GetPresignedUrlForOfferInput,
  ) {
    // Check token exists

    if (!hrUser || hrUser.role !== "HR_ADMIN") {
      throw new UnauthorizedError("You Are Not Authorized To Do This");
    }

    // generate unique storage key
    const fileExtension = payload.fileName.split(".").pop();

    if (fileExtension?.toLocaleLowerCase() !== "docx") {
      throw new BadRequestError("File format not accepted");
    }

    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(payload.mimeType)) {
      throw new BadRequestError("Invalid file type");
    }

    const safeFileName = payload.fileName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const storageKey = `offer_letter_templates/${hrUser.companyId}/${Date.now()}-${safeFileName}`;

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

static async uploadOfferLetterService(
  hrUser: User,
  payload: OfferLetterTemplateInput,
) {
  // authorize
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This",
    );
  }

  console.log("companyId is " , hrUser.companyId)
  // deactivate current active template
  await prismaClient.offerLetterTemplate.updateMany({
    where: {
      companyId: hrUser.companyId,
      isActive: true,
    },

    data: {
      isActive: false,
    },
  });

  // create new template
  const template =
    await prismaClient.offerLetterTemplate.create({
      data: {
        companyId: hrUser.companyId,

        uploadedById: hrUser.userId,

        fileName: payload.fileName,

        storageKey: payload.storageKey,

        isActive: true,
      },
    });

  return {
    message:
      "Offer letter template uploaded successfully",

    template,
  };
}


static async getOfferLetterTemplateService(
  hrUser: User,
) {
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This",
    );
  }

  const template =
    await prismaClient.offerLetterTemplate.findFirst({
      where: {
        companyId: hrUser.companyId,
        // isActive: true,
      },
    });

    console.log("the template is ", template)
  if (!template) {
    throw new NotFoundError(
      "No active offer letter template found",
    );
  }

  return {
    message:
      "Offer letter template fetched successfully",

    template,
  };
}

static async downloadOfferLetterTemplateService(
  hrUser: User,
) {
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This",
    );
  }

  const template =
    await prismaClient.offerLetterTemplate.findFirst({
      where: {
        companyId: hrUser.companyId,
        isActive: true,
      },
    });

  if (!template) {
    throw new NotFoundError(
      "No active offer letter template found",
    );
  }

  const command =
    new GetObjectCommand({
      Bucket:
        process.env.AWS_BUCKET_NAME,

      Key: template.storageKey,
    });

  const downloadUrl =
    await getSignedUrl(
      aws3Client,
      command,
      {
        expiresIn: 60 * 5,
      },
    );

  return {
    message:
      "Download URL generated successfully",

    fileName: template.fileName,

    downloadUrl,

    expiresIn: 300,
  };
}
}
