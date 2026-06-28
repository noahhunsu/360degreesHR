/**
 * @swagger
 * /requisitions/job-requisitions:
 *   post:
 *     summary: Create a job requisition
 *     tags:
 *       - Job Requisitions
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
 *               - departmentId
 *               - jobTitle
 *               - numberOfPositions
 *               - salaryRangeMin
 *               - salaryRangeMax
 *               - reason
 *               - priority
 *             properties:
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               jobTitle:
 *                 type: string
 *               numberOfPositions:
 *                 type: integer
 *               salaryRangeMin:
 *                 type: number
 *               salaryRangeMax:
 *                 type: number
 *               reason:
 *                 type: string
 *               priority:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Job requisition created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Requisition already exists
 */

/**
 * @swagger
 * /requisitions/job-requisitions:
 *   get:
 *     summary: Get all job requisitions
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Job requisitions fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /requisitions/job-requisitions/stats:
 *   get:
 *     summary: Get job requisition statistics
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Job requisition statistics fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /requisitions/job-requisitions/{requisitionId}:
 *   get:
 *     summary: Get a single job requisition
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: requisitionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job requisition fetched successfully
 *       400:
 *         description: Invalid requisition ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job requisition not found
 */

/**
 * @swagger
 * /requisitions/job-requisitions/{requisitionId}:
 *   patch:
 *     summary: Update a job requisition
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: requisitionId
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
 *               jobTitle:
 *                 type: string
 *               numberOfPositions:
 *                 type: integer
 *               salaryRangeMin:
 *                 type: number
 *               salaryRangeMax:
 *                 type: number
 *               reason:
 *                 type: string
 *               priority:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Job requisition updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job requisition not found
 *       409:
 *         description: Only pending requisitions can be updated
 */

/**
 * @swagger
 * /requisitions/job-requisitions/{requisitionId}:
 *   delete:
 *     summary: Cancel a job requisition
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: requisitionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Job requisition cancelled successfully
 *       400:
 *         description: Invalid requisition ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job requisition not found
 *       409:
 *         description: Only pending requisitions can be cancelled
 */

/**
 * @swagger
 * /requisitions/job-requisitions/{requisitionId}/review:
 *   patch:
 *     summary: Approve or reject a job requisition
 *     tags:
 *       - Job Requisitions
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: requisitionId
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
 *               - isRejected
 *             properties:
 *               isRejected:
 *                 type: boolean
 *                 example: false
 *               rejectionReason:
 *                 type: string
 *                 example: Budget constraints
 *                 description: Required when isRejected is true.
 *
 *     responses:
 *       200:
 *         description: Job requisition reviewed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pending job requisition not found
 */