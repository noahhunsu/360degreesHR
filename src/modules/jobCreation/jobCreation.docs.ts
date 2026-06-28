/**
 * @swagger
 * /recruitment/job-openings:
 *   post:
 *     summary: Create a new job opening
 *     tags:
 *       - Job Openings
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
 *               - requisitionId
 *               - title
 *               - description
 *               - employmentType
 *               - settings
 *               - hiringTeam
 *               - stages
 *             properties:
 *               requisitionId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               settings:
 *                 type: object
 *                 properties:
 *                   numberOfOpenings:
 *                     type: integer
 *                   openingDate:
 *                     type: string
 *                     format: date-time
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 *                   evaluationScale:
 *                     type: integer
 *               hiringTeam:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     role:
 *                       type: string
 *                       enum:
 *                         - HIRING_MANAGER
 *                         - RECRUITER
 *                         - INTERVIEWER
 *               jobOpeningDocuments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     isRequired:
 *                       type: boolean
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     position:
 *                       type: integer
 *                     isRequired:
 *                       type: boolean
 *
 *     responses:
 *       201:
 *         description: Job opening created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /recruitment/job-openings/stats:
 *   get:
 *     summary: Get job opening statistics
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Job opening statistics fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /recruitment/job-openings:
 *   get:
 *     summary: Get all job openings
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Job openings fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /recruitment/job-openings/{jobOpeningId}:
 *   get:
 *     summary: Get a single job opening
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job opening fetched successfully
 *       400:
 *         description: Invalid job opening ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job opening not found
 */

/**
 * @swagger
 * /reruitment/job-openings/{jobOpeningId}:
 *   patch:
 *     summary: Update a job opening
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               settings:
 *                 type: object
 *               hiringTeam:
 *                 type: array
 *                 items:
 *                   type: object
 *               jobOpeningDocuments:
 *                 type: array
 *                 items:
 *                   type: object
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *
 *     responses:
 *       200:
 *         description: Job opening updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job opening not found
 */

/**
 * @swagger
 * /recruitment/job-openings/{jobOpeningId}/publish:
 *   patch:
 *     summary: Publish a job opening
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job opening published successfully
 *       400:
 *         description: Invalid job opening ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job opening not found
 */

/**
 * @swagger
 * /recruitment/job-openings/{jobOpeningId}/close:
 *   patch:
 *     summary: Close a job opening
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job opening closed successfully
 *       400:
 *         description: Invalid job opening ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job opening not found
 */

/**
 * @swagger
 * /recruitment/job-openings/{jobOpeningId}/reopen:
 *   patch:
 *     summary: Reopen a closed job opening
 *     tags:
 *       - Job Openings
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job opening reopened successfully
 *       400:
 *         description: Invalid job opening ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job opening not found
 */