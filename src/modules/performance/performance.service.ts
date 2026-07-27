import { prismaClient } from "../../config/db.js";

import { assertHR, assertUser, getEmployee } from "../../utils/global.utils.js";
import type { User } from "../../shared/types/global.types.js";
import type { Employee, Prisma, ReviewInstanceStatus } from "@prisma/client";
import type {
  PerformanceAssignmentInput,
  PerformanceReviewerTypeInput,
  PerformanceReviewInput,
  PerformanceReviewNodeInput,
  PerformanceTemplateInput,
  UpdateMyReviewInput,
  UpdatePerformanceTemplateInput,
} from "./performance.validation.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../shared/exceptions/app.error.js";
export class PerformanceService {
  static async createPerformanceTemplateService(
    user: User,
    payload: PerformanceTemplateInput,
  ) {
    assertHR(user);

    return await prismaClient.$transaction(async (tx) => {
      const template = await tx.performanceTemplate.create({
        data: {
          companyId: user.companyId,
          name: payload.name,
          ...(payload.description && { description: payload.description }),
          reviewFrequency: payload.reviewFrequency,
          createdById: user.userId,
        },
      });

      for (let index = 0; index < payload.nodes.length; index++) {
        await this.createPerformanceNode(
          tx,
          template.id,
          payload.nodes[index],
          null,
        );
      }

      return template;
    });
  }

  static async updatePerformanceTemplateService(
    user: User,
    templateId: string,
    payload: UpdatePerformanceTemplateInput,
  ) {
    assertHR(user);

    return await prismaClient.$transaction(async (tx) => {
      const existingTemplate = await tx.performanceTemplate.findFirst({
        where: {
          id: templateId,
          companyId: user.companyId,
        },
      });

      if (!existingTemplate) {
        throw new NotFoundError("Performance template not found");
      }

      const template = await tx.performanceTemplate.update({
        where: {
          id: templateId,
        },
        data: {
          ...(payload.name && { name: payload.name }),
          ...(payload.description && { description: payload.description }),
          ...(payload.reviewFrequency && {
            reviewFrequency: payload.reviewFrequency,
          }),
        },
      });

      if (payload.nodes) {
        await tx.performanceNode.deleteMany({
          where: {
            templateId: template.id,
          },
        });

        for (let index = 0; index < payload.nodes.length; index++) {
          await this.createPerformanceNode(
            tx,
            template.id,
            payload.nodes[index],
            null,
          );
        }
      }

      return await tx.performanceTemplate.findUnique({
        where: {
          id: template.id,
        },
        include: {
          nodes: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      });
    });
  }
  static async getAllPerformanceTemplateService(user: User) {
    assertHR(user);

    return await prismaClient.performanceTemplate.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        nodes: {
          include: {
            children: true,
          },
        },
      },
    });
  }
  static async getSinglePerformanceTemplateService(
    user: User,
    templateId: string,
  ) {
    assertHR(user);

    return await prismaClient.performanceTemplate.findFirst({
      where: {
        id: templateId,
        companyId: user.companyId,
      },
      include: {
        nodes: {
          include: {
            children: true,
          },
        },
      },
    });
  }
  static async deleteSinglePerformanceTemplateService(
    user: User,
    templateId: string,
  ) {
    assertHR(user);

    return await prismaClient.performanceTemplate.delete({
      where: {
        id: templateId,
      },
    });
  }

  static async createPerformanceReviewService(
    user: User,
    payload: PerformanceReviewInput,
  ) {
    assertHR(user);

    return await prismaClient.$transaction(async (tx) => {
      const performanceReview = await tx.performanceReview.create({
        data: {
          companyId: user.companyId,
          name: payload.reviewName,
          ...(payload.description && {
            description: payload.description,
          }),
          startDate: payload.startDate,
          dueDate: payload.dueDate,
          status:
            payload.assign && payload.assign.targets.length > 0
              ? "ASSIGNED"
              : "DRAFT",
          createdById: user.userId,
        },
      });

      if (payload.nodes && payload.nodes.length > 0) {
        for (let index = 0; index < payload.nodes.length; index++) {
          await this.createPerformanceReviewNode(
            tx,
            performanceReview.id,
            payload.nodes[index],
            null,
          );
        }
      }

      if (payload.assign) {
        await this.assignPerformanceReview(
          tx,
          performanceReview.id,
          user.companyId,
          payload.assign.targets,
          payload.assign.reviewers,
        );
      }
      return performanceReview;
    });
  }

  static async getMyReviewsService(user: User) {
    assertUser(user);

    const employee = await getEmployee(user);

    return await prismaClient.performanceReviewInstance.findMany({
      where: {
        employeeId: employee.id,
        review: {
          companyId: user.companyId,
        },
      },
      include: {
        review: true,
        reviewers: {
          include: {
            reviewer: true,
          },
        },
        employee: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getMyReviewTasksService(user: User) {
    assertUser(user);

    const employee = await getEmployee(user);

    return await prismaClient.performanceReviewInstance.findMany({
      where: {
        review: {
          companyId: user.companyId,
        },
        reviewers: {
          some: {
            reviewerId: employee.id,
          },
        },
      },
      include: {
        review: true,
        employee: true,
        reviewers: {
          where: {
            reviewerId: employee.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllReviewInstancesService(user: User) {
    assertHR(user);

    return await prismaClient.performanceReviewInstance.findMany({
      where: {
        review: {
          companyId: user.companyId,
        },
      },
      include: {
        employee: true,
        review: true,
        reviewers: {
          include: {
            reviewer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getSingleReviewTaskService(
    user: User,
    performanceReviewerId: string,
  ) {
    assertUser(user);

    const employee = await getEmployee(user);

    const review = await prismaClient.performanceReviewer.findFirst({
      where: {
        id: performanceReviewerId,
        reviewerId: employee.id,
        reviewInstance: {
          review: {
            companyId: user.companyId,
          },
        },
      },
      include: {
        reviewInstance: {
          include: {
            employee: {
              include: {
                department: true,
              },
            },
            review: {
              include: {
                nodes: {
                  where: {
                    parentId: null,
                  },

                  include: {
                    children: true,
                  },
                },
              },
            },
          },
        },

        scores: {
          include: {
            reviewNode: true,
          },
        },

        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },

        attachments: true,
      },
    });

    if (!review) {
      throw new NotFoundError("Performance review not found.");
    }

    return review;
  }

  // The employee loads a single review where they are the subject
  static async getSingleReviewForSubjectService(
    user: User,
    reviewInstanceId: string,
  ) {
    assertUser(user);

    const employee = await getEmployee(user);

    const review = await prismaClient.performanceReviewInstance.findFirst({
      where: {
        id: reviewInstanceId,
        review: {
          companyId: user.companyId,
        },
        OR: [
          {
            subjectType: "EMPLOYEE",
            employeeId: employee.id,
          },
          {
            subjectType: "DEPARTMENT",
            departmentId: employee.departmentId,
          },
        ],
      },
      include: {
        review: {
          include: {
            nodes: {
              where: {
                parentId: null,
              },
              orderBy: {
                displayOrder: "asc",
              },
              include: {
                children: {
                  orderBy: {
                    displayOrder: "asc",
                  },
                },
              },
            },
          },
        },

        employee: {
          include: {
            department: true,
          },
        },

        reviewers: {
          include: {
            reviewer: true,

            scores: {
              include: {
                reviewNode: true,
              },
            },

            comments: {
              orderBy: {
                createdAt: "asc",
              },
            },

            attachments: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundError("Performance review not found.");
    }

    return review;
  }
  static async getSingleReviewForHrService(
    user: User,
    reviewInstanceId: string,
  ) {
    assertHR(user);

    const review = await prismaClient.performanceReviewInstance.findFirst({
      where: {
        id: reviewInstanceId,
        review: {
          companyId: user.companyId,
        },
      },
      include: {
        review: {
          include: {
            createdBy: true,

            performanceReviewAssignments: true,

            nodes: {
              where: {
                parentId: null,
              },
              orderBy: {
                displayOrder: "asc",
              },
              include: {
                children: {
                  orderBy: {
                    displayOrder: "asc",
                  },
                },
              },
            },
          },
        },

        employee: {
          include: {
            department: true,
          },
        },

        department: true,

        reviewers: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            reviewer: {
              include: {
                department: true,
              },
            },

            scores: {
              orderBy: {
                createdAt: "asc",
              },
              include: {
                reviewNode: true,
              },
            },

            comments: {
              orderBy: {
                createdAt: "asc",
              },
            },

            attachments: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundError("Performance review not found.");
    }

    return review;
  }

  static async reviewMyTaskService(
    user: User,
    performanceReviewerId: string,
    payload: UpdateMyReviewInput,
  ) {
    assertUser(user);

    const employee = await getEmployee(user);

    const performanceReview = await prismaClient.performanceReviewer.findFirst({
      where: {
        id: performanceReviewerId,
        reviewerId: employee.id,
        reviewInstance: {
          review: {
            companyId: user.companyId,
          },
        },
      },
      include: {
        reviewInstance: {
          include: {
            employee: {
              include: {
                department: true,
              },
            },
            review: {
              include: {
                nodes: {
                  where: {
                    parentId: null,
                  },
                  include: {
                    children: true,
                  },
                },
              },
            },
          },
        },
        scores: true,
        comments: true,
      },
    });

    if (!performanceReview) {
      throw new NotFoundError("Review not found");
    }

    if (performanceReview.status === "SUBMITTED") {
      throw new BadRequestError("You can't update an already submitted review");
    }

    const flattenedReviewNodes = this.flattenReviewNodes(
      performanceReview.reviewInstance.review.nodes,
    );

    this.validateReviewPayload(flattenedReviewNodes, payload);
    let status = payload.isDraft ? "IN_PROGRESS" : "SUBMITTED";
    const transaction = await prismaClient.$transaction(async (tx) => {
      await this.upsertReviewScores(tx, payload, performanceReviewerId);

      if (!payload.isDraft) {
        await this.createAttachments(tx, payload, performanceReviewerId);
      }
      await tx.performanceReviewer.update({
        where: {
          id: performanceReviewerId,
        },
        data: {
          status: status as ReviewInstanceStatus,
          ...(!payload.isDraft && { submittedAt: new Date() }),
          ...(!payload.isDraft && { completedAt: new Date() }),
        },
      });

      await this.completePerformanceReviewer(tx, performanceReviewerId);
      return await tx.performanceReviewer.findUnique({
        where: {
          id: performanceReviewerId,
        },
        include: {
          scores: true,
          attachments: true,
        },
      });
    });
  }

 static async closePerformanceReviewService(
  user: User,
  reviewId: string,
) {
  assertHR(user);

  return await prismaClient.$transaction(async (tx) => {
    const review = await tx.performanceReview.findFirst({
      where: {
        id: reviewId,
        companyId: user.companyId,
      },
      include: {
        instances: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundError("Performance review not found.");
    }

    if (review.status === "CLOSED") {
      throw new BadRequestError(
        "Performance review has already been closed.",
      );
    }

    if (review.instances.length === 0) {
      throw new BadRequestError(
        "This review has no assigned review instances.",
      );
    }

    await this.completePerformanceReview(
      tx,
      review.id,
    );

    return await tx.performanceReview.update({
      where: {
        id: review.id,
      },
      data: {
        status: "CLOSED",
      },
      include: {
        instances: true,
      },
    });
  });
}

  private static async completePerformanceReviewer(
    tx: Prisma.TransactionClient,
    reviewerId: string,
  ) {
    const reviewer = await tx.performanceReviewer.findUnique({
      where: {
        id: reviewerId,
      },
      include: {
        scores: {
          include: {
            reviewNode: true,
          },
        },
      },
    });

    if (!reviewer) {
      throw new NotFoundError("Reviewer not found");
    }

    let totalWeight = 0;
    let weightedScore = 0;

    for (const score of reviewer.scores) {
      const weight = Number(score.reviewNode.weight);

      totalWeight += weight;

      weightedScore += Number(score.score ?? 0) * weight;
    }

    const overallScore = totalWeight === 0 ? 0 : weightedScore / totalWeight;

    return await tx.performanceReviewer.update({
      where: {
        id: reviewerId,
      },
      data: {
        overallScore,
        status: "SUBMITTED",
        submittedAt: new Date(),
        completedAt: new Date(),
      },
    });
  }

  private static async assignPerformanceReview(
    tx: Prisma.TransactionClient,
    reviewId: string,
    companyId: string,
    assignments: PerformanceAssignmentInput[],
    reviewerTypes: PerformanceReviewerTypeInput[],
  ) {
    for (const assignment of assignments) {
      const employees = await this.resolveAssignmentEmployees(
        tx,
        companyId,
        assignment,
      );

      for (const employee of employees) {
        const instance = await tx.performanceReviewInstance.create({
          data: {
            reviewId,
            subjectType: "EMPLOYEE",
            employeeId: employee.id,
            status: "PENDING",
          },
        });

        await this.createPerformanceReviewers(
          tx,
          instance.id,
          employee,
          reviewerTypes,
        );
      }
    }
  }

  private static async resolveAssignmentEmployees(
    tx: Prisma.TransactionClient,
    companyId: string,
    assignment: PerformanceAssignmentInput,
  ) {
    switch (assignment.type) {
      case "EMPLOYEE":
        return await tx.employee.findMany({
          where: {
            id: assignment.id,
            companyId,
          },
        });

      case "DEPARTMENT":
        return await tx.employee.findMany({
          where: {
            departmentId: assignment.id,
            companyId,
            employmentStatus: "ACTIVE",
          },
        });

      case "POSITION":
        return await tx.employee.findMany({
          where: {
            positionId: assignment.id,
            companyId,
            employmentStatus: "ACTIVE",
          },
        });

      default:
        throw new BadRequestError("Invalid assignment type.");
    }
  }

  private static async createPerformanceReviewers(
    tx: Prisma.TransactionClient,
    instanceId: string,
    employee: Employee,
    reviewerTypes: PerformanceReviewerTypeInput[],
  ) {
    for (const reviewerType of reviewerTypes) {
      const reviewerId = await this.resolveReviewer(tx, employee, reviewerType);

      if (!reviewerId) {
        continue;
      }

      await tx.performanceReviewer.create({
        data: {
          reviewInstanceId: instanceId,
          reviewerId,
          status: "PENDING",
        },
      });
    }
  }

  private static async resolveReviewer(
    tx: Prisma.TransactionClient,
    employee: Employee,
    reviewerType: PerformanceReviewerTypeInput,
  ): Promise<string | null> {
    switch (reviewerType.type) {
      case "SELF":
        return employee.id;

      case "MANAGER":
        return employee.managerId;

      case "HR": {
        const hr = await tx.employee.findFirst({
          where: {
            companyId: employee.companyId,
            jobTitle: "HR Manager",
          },
        });

        return hr?.id ?? null;
      }

      default:
        return null;
    }
  }

  private static async createPerformanceReviewNode(
    tx: Prisma.TransactionClient,
    reviewId: string,
    node: PerformanceReviewNodeInput,
    parentId: string | null,
  ): Promise<void> {
    const createdNode = await tx.performanceReviewNode.create({
      data: {
        reviewId,
        parentId,
        type: node.type,
        name: node.name,

        ...(node.description && {
          description: node.description,
        }),

        weight: node.weight,

        ...(node.scoreType && {
          scoreType: node.scoreType,
        }),

        ...(node.maximumScore !== undefined && {
          maximumScore: node.maximumScore,
        }),
      },
    });

    if (node.children && node.children.length > 0) {
      for (let index = 0; index < node.children.length; index++) {
        await this.createPerformanceReviewNode(
          tx,
          reviewId,
          node.children[index],
          createdNode.id,
        );
      }
    }
  }
  private static async assignPermanceReviewService() {}
  private static async createPerformanceNode(
    tx: Prisma.TransactionClient,
    templateId: string,
    node: PerformanceTemplateInput["nodes"][number],
    parentId: string | null,
  ): Promise<void> {
    const createdNode = await tx.performanceNode.create({
      data: {
        templateId,
        parentId,
        name: node.name,
        description: node.description,
        type: node.type,
      },
    });

    for (let index = 0; index < node.children.length; index++) {
      await this.createPerformanceNode(
        tx,
        templateId,
        node.children[index],
        createdNode.id,
      );
    }
  }
  private static flattenReviewNodes(
    nodes: Prisma.PerformanceReviewNodeGetPayload<{
      include: {
        children: true;
      };
    }>[],
  ): Prisma.PerformanceReviewNodeGetPayload<{
    include: {
      children: true;
    };
  }>[] {
    const flattened: Prisma.PerformanceReviewNodeGetPayload<{
      include: {
        children: true;
      };
    }>[] = [];

    for (const node of nodes) {
      if (!node.children || node.children.length === 0) {
        flattened.push(node);
        continue;
      }

      flattened.push(...this.flattenReviewNodes(node.children));
    }

    return flattened;
  }

  private static validateReviewPayload(
    reviewNodes: Prisma.PerformanceReviewNodeGetPayload<{
      include: {
        children: true;
      };
    }>[],
    payload: UpdateMyReviewInput,
  ) {
    const reviewNodeMap = new Map(reviewNodes.map((node) => [node.id, node]));

    const reviewedNodes = new Set<string>();

    for (const score of payload.scores) {
      const reviewNode = reviewNodeMap.get(score.reviewNodeId);

      if (!reviewNode) {
        throw new BadRequestError(
          `Review node '${score.reviewNodeId}' does not belong to this review.`,
        );
      }

      if (reviewedNodes.has(score.reviewNodeId)) {
        throw new BadRequestError(
          `Duplicate score submitted for '${reviewNode.name}'.`,
        );
      }

      reviewedNodes.add(score.reviewNodeId);

      if (score.score < 0) {
        throw new BadRequestError(
          `${reviewNode.name} cannot have a negative score.`,
        );
      }

      if (
        reviewNode.maximumScore !== null &&
        reviewNode.maximumScore !== undefined &&
        score.score > Number(reviewNode.maximumScore)
      ) {
        throw new BadRequestError(
          `${reviewNode.name} cannot exceed the maximum score of ${reviewNode.maximumScore}.`,
        );
      }
    }

    if (!payload.isDraft) {
      if (reviewedNodes.size !== reviewNodes.length) {
        throw new BadRequestError(
          "All review items must be scored before submitting.",
        );
      }
    }
  }

  private static async upsertReviewScores(
    tx: Prisma.TransactionClient,
    payload: UpdateMyReviewInput,
    reviewerId: string,
  ) {
    for (const score of payload.scores) {
      const reviewScore = await tx.performanceReviewScore.findFirst({
        where: {
          reviewerId,
          reviewNodeId: score.reviewNodeId,
        },
      });

      if (!reviewScore) {
        const reviewedScore = await tx.performanceReviewScore.create({
          data: {
            reviewerId,
            reviewNodeId: score.reviewNodeId,
            score: score.score,
            ...(score.comment && { comment: score.comment }),
          },
        });
        continue;
      }

      const updatedScore = await tx.performanceReviewScore.update({
        where: {
          id: reviewScore!.id,
        },
        data: {
          score: score.score,
          ...(score.comment && { comment: score.comment }),
        },
      });
    }
  }

  private static async createAttachments(
    tx: Prisma.TransactionClient,
    payload: UpdateMyReviewInput,
    reviewerId: string,
  ) {
    if (payload.attachments && payload.attachments.length > 0) {
      for (const attachment of payload.attachments) {
        await tx.performanceReviewAttachment.create({
          data: {
            reviewerId,
            documentType: attachment.documentType,
            originalFileName: attachment.originalFileName,
            storageKey: attachment.storageKey,
            mimeType: attachment.mimeType,
            ...(attachment.description && {
              description: attachment.description,
            }),
          },
        });
      }
    }
  }


  private static async calculateReviewOverallScore(){

  }

  private static async calculateReviewerOverallScore(
  tx: Prisma.TransactionClient,
  reviewerId: string,
): Promise<number> {

  const scores = await tx.performanceReviewScore.findMany({
    where: {
      reviewerId,
    },
    include: {
      reviewNode: true,
    },
  });

  if (scores.length === 0) {
    await tx.performanceReviewer.update({
      where: {
        id: reviewerId,
      },
      data: {
        overallScore: null,
      },
    });

    return 0;
  }

  let totalWeight = 0;
  let weightedScore = 0;

  for (const score of scores) {

    if (
      score.reviewNode.type !== "ITEM" ||
      score.score === null
    ) {
      continue;
    }

    const weight = Number(score.reviewNode.weight);
    const value = Number(score.score);

    weightedScore += value * weight;
    totalWeight += weight;
  }

  const overallScore =
    totalWeight === 0
      ? 0
      : Number((weightedScore / totalWeight).toFixed(2));

  await tx.performanceReviewer.update({
    where: {
      id: reviewerId,
    },
    data: {
      overallScore,
    },
  });

  return overallScore;
}

private static async calculateInstanceOverallScore(
  tx: Prisma.TransactionClient,
  reviewInstanceId: string,
): Promise<number> {

  const reviewers = await tx.performanceReviewer.findMany({
    where: {
      reviewInstanceId,
      status: "SUBMITTED",
    },
  });

  if (reviewers.length === 0) {
    await tx.performanceReviewInstance.update({
      where: {
        id: reviewInstanceId,
      },
      data: {
        overallScore: null,
      },
    });

    return 0;
  }

  let totalWeight = 0;
  let weightedScore = 0;

  for (const reviewer of reviewers) {

    if (reviewer.overallScore === null) {
      continue;
    }

    const weight = Number(reviewer.weight);
    const score = Number(reviewer.overallScore);

    weightedScore += score * weight;
    totalWeight += weight;
  }

  const overallScore =
    totalWeight === 0
      ? 0
      : Number((weightedScore / totalWeight).toFixed(2));

  await tx.performanceReviewInstance.update({
    where: {
      id: reviewInstanceId,
    },
    data: {
      overallScore,
      completedAt: new Date(),
      status: "COMPLETED",
    },
  });

  return overallScore;
}

private static async completeReviewInstance(
  tx: Prisma.TransactionClient,
  reviewInstanceId: string,
) {
  const instance = await tx.performanceReviewInstance.findUnique({
    where: {
      id: reviewInstanceId,
    },
    include: {
      reviewers: true,
    },
  });

  if (!instance) {
    throw new NotFoundError("Performance review instance not found.");
  }

  const pendingReviewers = instance.reviewers.filter(
    (reviewer) => reviewer.status !== "SUBMITTED",
  );

  if (pendingReviewers.length > 0) {
    throw new BadRequestError(
      "Some reviewers have not yet submitted their reviews.",
    );
  }

  const overallScore = await this.calculateInstanceOverallScore(
    tx,
    reviewInstanceId,
  );

  const updatedInstance = await tx.performanceReviewInstance.update({
    where: {
      id: reviewInstanceId,
    },
    data: {
      overallScore,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  return updatedInstance;
}
private static async completePerformanceReview(
  tx: Prisma.TransactionClient,
  reviewId: string,
) {
  const review = await tx.performanceReview.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      instances: true,
    },
  });

  if (!review) {
    throw new NotFoundError("Performance review not found.");
  }

  const pendingInstances = review.instances.filter(
    (instance) => instance.status !== "COMPLETED",
  );

  if (pendingInstances.length > 0) {
    throw new BadRequestError(
      "Some review instances have not been completed.",
    );
  }

  const overallScore =
    review.instances.length === 0
      ? null
      : review.instances.reduce(
          (sum, instance) => sum + Number(instance.overallScore ?? 0),
          0,
        ) / review.instances.length;

  return await tx.performanceReview.update({
    where: {
      id: reviewId,
    },
    data: {
      status: "CLOSED",
      completedAt: new Date(),
      overallScore,
    },
  });
}
}


