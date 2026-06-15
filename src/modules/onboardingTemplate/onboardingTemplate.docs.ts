/**
 * @swagger
 * /onboarding-template:
 *   post:
 *     summary: Create onboarding template
 *     description: Creates a new onboarding template with required document checklist.
 *     tags:
 *       - Onboarding Template
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - documentRequirements
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Standard Employee Onboarding"
 *
 *               description:
 *                 type: string
 *                 example: "Default onboarding template for new hires"
 *
 *               documentRequirements:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - documentType
 *                     - isRequired
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       example: "ID_CARD"
 *                     isRequired:
 *                       type: boolean
 *                       example: true
 *                     description:
 *                       type: string
 *                       example: "National ID or Passport"
 *
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Template Created successfully
 *                 data:
 *                   type: object
 *
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /onboarding-template:
 *   get:
 *     summary: Get all onboarding templates
 *     description: Retrieves all onboarding templates for the company.
 *     tags:
 *       - Onboarding Template
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Templates fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-template/{templateId}:
 *   get:
 *     summary: Get single onboarding template
 *     tags:
 *       - Onboarding Template
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *
 *     responses:
 *       200:
 *         description: Template fetched successfully
 *       400:
 *         description: Invalid template ID
 *       404:
 *         description: Template not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-template/{templateId}:
 *   put:
 *     summary: Update onboarding template
 *     tags:
 *       - Onboarding Template
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Template Name"
 *
 *               description:
 *                 type: string
 *
 *               documentRequirements:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     documentType:
 *                       type: string
 *                     isRequired:
 *                       type: boolean
 *                     description:
 *                       type: string
 *
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       400:
 *         description: Invalid template ID or payload
 *       404:
 *         description: Template not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-template/{templateId}:
 *   delete:
 *     summary: Delete onboarding template
 *     tags:
 *       - Onboarding Template
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *
 *       400:
 *         description: Invalid template ID
 *       404:
 *         description: Template not found
 *       401:
 *         description: Unauthorized
 */