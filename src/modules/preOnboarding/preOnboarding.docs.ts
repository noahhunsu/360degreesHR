/**
 * @swagger
 * /onboarding:
 *   post:
 *     summary: Create onboarding invitation
 *     tags:
 *       - Pre Onboarding
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - templateId
 *               - departmentId
 *               - jobTitle
 *               - compensation
 *               - employmentType
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               templateId:
 *                 type: string
 *                 format: uuid
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               jobTitle:
 *                 type: string
 *               compensation:
 *                 type: number
 *               managerId:
 *                 type: string
 *                 format: uuid
 *               employmentType:
 *                 type: string
 *                 enum:
 *                   - FULL_TIME
 *                   - PART_TIME
 *                   - CONTRACT
 *                   - INTERN
 *               expiresInDays:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *                 default: 7
 *               offerLetter:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Onboarding Invitation Created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding/token:
 *   get:
 *     summary: Get onboarding invitation details using token
 *     tags:
 *       - Pre Onboarding
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Onboarding Invitation fetched successfully
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Invitation not found
 */


/**
 * @swagger
 * /onboarding/submit:
 *   post:
 *     summary: Submit onboarding information
 *     tags:
 *       - Pre Onboarding
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - firstName
 *               - lastName
 *               - gender
 *             properties:
 *               token:
 *                 type: string
 *
 *               firstName:
 *                 type: string
 *
 *               lastName:
 *                 type: string
 *
 *               phoneNumber:
 *                 type: string
 *
 *               address:
 *                 type: string
 *
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *
 *               emergencyContactName:
 *                 type: string
 *
 *               emergencyContactPhone:
 *                 type: string
 *
 *               gender:
 *                 type: string
 *                 enum:
 *                   - MALE
 *                   - FEMALE
 *                   - OTHER
 *
 *               isDraft:
 *                 type: boolean
 *                 default: true
 *
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - documentType
 *                     - originalFileName
 *                     - storageKey
 *                     - mimeType
 *                     - fileSize
 *                   properties:
 *                     documentType:
 *                       type: string
 *                     originalFileName:
 *                       type: string
 *                     storageKey:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *                     fileSize:
 *                       type: number
 *
 *     responses:
 *       201:
 *         description: Submission successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: Invitation not found
 */

/**
 * @swagger
 * /onboarding/submissions:
 *   get:
 *     summary: Get all onboarding submissions
 *     tags:
 *       - Pre Onboarding
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Submissions fetched successfully
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
 * /onboarding/submissions/{submissionId}:
 *   get:
 *     summary: Get a single onboarding submission
 *     tags:
 *       - Pre Onboarding
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Submission fetched successfully
 *       404:
 *         description: Submission not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding/submissions/{submissionId}:
 *   patch:
 *     summary: Approve or reject onboarding submission
 *     tags:
 *       - Pre Onboarding
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: submissionId
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: APPROVED
 *
 *               rejectionReason:
 *                 type: string
 *                 example: Missing required identification document
 *
 *     responses:
 *       200:
 *         description: Submission updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Submission not found
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /onboarding/submissions/{submissionId}/document/{documentId}:
 *   post:
 *     summary: Generate document view URL for onboarding submission document
 *     tags:
 *       - Pre Onboarding
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Onboarding submission ID
 *
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Onboarding document ID
 *
 *     responses:
 *       200:
 *         description: Submission document fetched successfully
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
 *                   example: Submission Document fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentViewUrl:
 *                       type: string
 *                       format: uri
 *                       example: https://bucket.s3.amazonaws.com/file.pdf?X-Amz-Signature=abc123
 *                     fileName:
 *                       type: string
 *                       example: international-passport.pdf
 *                     mimeType:
 *                       type: string
 *                       example: application/pdf
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You need to be authorized
 *
 *       404:
 *         description: Onboarding document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Onboarding document not found
 *
 *       500:
 *         description: Internal server error
 */