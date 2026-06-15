// Creating new employee
// Get all employees
// Get specific employee
// update specific employee
// Delete specific employee

import { prismaClient } from "../../config/db.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/exceptions/app.error.js";
import type { User } from "../../shared/types/global.types.js";
import type { CreateOnboardingTemplateInput, UpdateSingleOnboardingTemplateInput } from "./onboardingTemplate.validation.js";

export class OnboardingTemplateService {
  static async createOnboardingTemplateService(
  payload: CreateOnboardingTemplateInput,
  hrUser: User,
) {

  // authorize user
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This"
    );
  }

  const createdTemplate =
    await prismaClient.$transaction(async (tx) => {

      // create onboarding template
      const onboardingTemplate =
        await tx.onboardingTemplate.create({
          data: {
            companyId: hrUser.companyId,

            name: payload.name,

            description: payload.description ?? "",

            createdById: hrUser.userId,
          },
        });

      // create document requirements
      await tx.templateDocumentRequirement.createMany({
        data: payload.documentRequirements.map((doc) => ({
          templateId: onboardingTemplate.id,

          documentType: doc.documentType,

          isRequired: doc.isRequired,

          description: doc.description ?? "",
        })),
      });

      // fetch template with requirements
      const fullTemplate =
        await tx.onboardingTemplate.findUnique({
          where: {
            id: onboardingTemplate.id,
          },

          include: {
            documentRequirements: true,
          },
        });

      return fullTemplate;
    });

  return createdTemplate;
}

  static async getOnboardingTemplateService(
  hrUser: User
) {

  // authorize user
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This"
    );
  }

  const fetchedTemplates = await prismaClient.onboardingTemplate.findMany({
    where : {
      companyId : hrUser.companyId , isActive : true
    } , 
    include : {
      documentRequirements : true
    } ,orderBy: {
        createdAt: "desc",
      },
  })

  return fetchedTemplates;
}

  static async getSingleOnboardingTemplateService(
  hrUser: User, 
  onboardingTemplateId : string
) {

  // authorize user
  if (!hrUser || hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "You Are Not Authorized To Do This"
    );
  }

  const fetchedTemplate = await prismaClient.onboardingTemplate.findFirst({
    where : {
      id : onboardingTemplateId , companyId : hrUser.companyId , isActive : true
    } , 
    include : {
      documentRequirements : true
    } 
  })

  return fetchedTemplate;
}

static async updateOnboardingTemplateService(
  hrUser: User,
  onboardingTemplateId: string,
  payload: UpdateSingleOnboardingTemplateInput
) {

  console.log("payload is " , payload)
  // authentication
  if (!hrUser) {
    throw new UnauthorizedError(
      "You are not authenticated"
    );
  }

  // authorization
  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError(
      "Only HR_ADMIN can update templates"
    );
  }

  // check template exists
  const template =
    await prismaClient.onboardingTemplate.findFirst({
      where: {
        id: onboardingTemplateId,

        companyId: hrUser.companyId,

        isActive: true,
      },
    });

  if (!template) {
    throw new NotFoundError(
      "Template not found"
    );
  }

  // check duplicate template name
  if (payload.name) {

    const existingTemplate =
      await prismaClient.onboardingTemplate.findFirst({
        where: {
          companyId: hrUser.companyId,

          name: payload.name,

          NOT: {
            id: onboardingTemplateId,
          },
        },
      });

    if (existingTemplate) {
      throw new ConflictError(
        "Template with this name already exists"
      );
    }
  }

  // transaction
  const updatedTemplate =
    await prismaClient.$transaction(async (tx) => {

      // update template
      await tx.onboardingTemplate.update({
        where: {
          id: onboardingTemplateId,
        },

        data: {
          name: payload.name || "",

          description: payload.description || "",
        },
      });

      // replace requirements if provided
      if (payload.documentRequirements) {

        // delete old requirements
        await tx.templateDocumentRequirement.deleteMany({
          where: {
            templateId: onboardingTemplateId,
          },
        });

        // create new requirements
        await tx.templateDocumentRequirement.createMany({
          data: payload.documentRequirements.map((doc) => ({
            templateId: onboardingTemplateId,

            documentType: doc.documentType,

            isRequired: doc.isRequired,

            description: doc.description ?? "",
          })),
        });
      }

      // fetch updated template
      const fullTemplate =
        await tx.onboardingTemplate.findUnique({
          where: {
            id: onboardingTemplateId,
          },

          include: {
            documentRequirements: true,
          },
        });

      return fullTemplate;
    });

  return updatedTemplate;
}

static async deleteOnboardingTemplateService(
  hrUser: User,
  templateId: string,
) {
  if (!hrUser) {
    throw new UnauthorizedError("You are not authenticated");
  }

  if (hrUser.role !== "HR_ADMIN") {
    throw new UnauthorizedError("Only HR_ADMIN can delete departments");
  }
  

  const onboardingTemplate = await prismaClient.onboardingTemplate.findFirst({
    where: {
      id: templateId,
      companyId: hrUser.companyId,
      isActive :true
      
    }
  });

  if (!onboardingTemplate) {
    throw new NotFoundError("Onboarding template not found");
  }

  /**
   * Soft delete
   */
  const deletedTemplate = await prismaClient.onboardingTemplate.update({
    where: {
      id: templateId,companyId : hrUser.companyId
    },
    data: {
      isActive : false
    },
  });

  return {
    message: "Template deleted successfully",
    department: deletedTemplate,
  };
}


}
