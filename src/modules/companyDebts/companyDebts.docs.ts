/**
 * @swagger
 * /job-applications/job-openings/{jobOpeningId}:
 *   post:
 *     summary: Submit a job application
 *     tags:
 *       - Job Applications
 *
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - documents
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               documents:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - documentType
 *                     - fileName
 *                     - storageKey
 *                     - mimeType
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       description: Candidate document type
 *                     fileName:
 *                       type: string
 *                     storageKey:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job opening not found
 */

/**
 * @swagger
 * /job-applications:
 *   get:
 *     summary: Get all job applications
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Job applications fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /job-applications/{applicationId}:
 *   get:
 *     summary: Get a single job application
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Job application fetched successfully
 *       400:
 *         description: Invalid application ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /job-applications/upload/upload-url:
 *   post:
 *     summary: Generate a presigned upload URL for applicant documents
 *     tags:
 *       - Job Applications
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - mimeType
 *               - documentType
 *             properties:
 *               fileName:
 *                 type: string
 *               mimeType:
 *                 type: string
 *               documentType:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /job-applications/{applicationId}/move:
 *   patch:
 *     summary: Move a job application to another recruitment stage
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: applicationId
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
 *             required:
 *               - stageId
 *             properties:
 *               stageId:
 *                 type: string
 *               notes:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Job application updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /job-applications/{applicationId}/reject:
 *   patch:
 *     summary: Reject a job application
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: applicationId
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
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Job application rejected successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */

/**
 * @swagger
 * /job-applications/{applicationId}/document/{documentId}:
 *   get:
 *     summary: View an uploaded application document
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Document URL generated successfully
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
 *                   properties:
 *                     documentViewUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *
 *       400:
 *         description: Invalid application or document ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */

