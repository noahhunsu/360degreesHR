/**
 * @swagger
 * /performance/template:
 *   post:
 *     summary: Create a performance template
 *     description: |
 *       Creates a reusable performance review template containing a hierarchy
 *       of sections, categories, and criteria.
 *
 *     tags:
 *       - Performance Management
 *
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
 *               - reviewFrequency
 *               - nodes
 *             properties:
 *               name:
 *                 type: string
 *                 example: Annual Performance Review
 *               description:
 *                 type: string
 *                 example: Standard annual employee appraisal
 *               reviewFrequency:
 *                 type: string
 *                 enum:
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - QUARTERLY
 *                   - BI_ANNUALLY
 *                   - ANNUALLY
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - type
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Technical Skills
 *                     description:
 *                       type: string
 *                       example: Evaluate technical competency
 *                     type:
 *                       type: string
 *                       enum:
 *                         - CATEGORY
 *                         - SECTION
 *                         - CRITERIA
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *           example:
 *             name: Annual Performance Review
 *             description: Company-wide annual review template
 *             reviewFrequency: ANNUALLY
 *             nodes:
 *               - name: Technical Skills
 *                 description: Technical evaluation
 *                 type: CATEGORY
 *                 children:
 *                   - name: Code Quality
 *                     type: CRITERIA
 *                     children: []
 *
 *     responses:
 *       201:
 *         description: Performance template created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /performance/template/{templateId}:
 *   patch:
 *     summary: Update a performance template
 *     description: |
 *       Updates an existing performance review template.
 *
 *     tags:
 *       - Performance Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
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
 *               name:
 *                 type: string
 *                 example: Updated Annual Review
 *               description:
 *                 type: string
 *                 example: Updated description
 *               reviewFrequency:
 *                 type: string
 *                 enum:
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - QUARTERLY
 *                   - BI_ANNUALLY
 *                   - ANNUALLY
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Leadership
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum:
 *                         - CATEGORY
 *                         - SECTION
 *                         - CRITERIA
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *           example:
 *             name: Updated Annual Review
 *             reviewFrequency: ANNUALLY
 *             nodes:
 *               - name: Leadership
 *                 type: CATEGORY
 *                 children: []
 *
 *     responses:
 *       200:
 *         description: Performance template updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Template not found
 */


/**
 * @swagger
 * /performance/template:
 *   get:
 *     summary: Get all performance templates
 *     description: Retrieves all performance review templates for the company.
 *
 *     tags:
 *       - Performance Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Performance templates fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /performance/template/{templateId}:
 *   get:
 *     summary: Get a single performance template
 *     description: |
 *       Retrieves a single performance template by its ID.
 *
 *       Returns the template details, including its review frequency
 *       and hierarchical performance nodes.
 *
 *     tags:
 *       - Performance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance template ID
 *
 *     responses:
 *       200:
 *         description: Performance template fetched successfully
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
 *                   example: Single template fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     reviewFrequency:
 *                       type: string
 *                       enum:
 *                         - WEEKLY
 *                         - MONTHLY
 *                         - QUARTERLY
 *                         - BIANNUALLY
 *                         - ANNUALLY
 *                     nodes:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *       400:
 *         description: Invalid template ID
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /performance/template/{templateId}:
 *   delete:
 *     summary: Delete a performance template
 *     description: |
 *       Permanently deletes a performance template.
 *
 *       Templates already being used by active performance reviews
 *       may not be eligible for deletion.
 *
 *     tags:
 *       - Performance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance template ID
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Template deleted Successfully
 *
 *       400:
 *         description: Invalid template ID
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /performance/template/{templateId}:
 *   delete:
 *     summary: Delete a performance template
 *     description: |
 *       Permanently deletes a performance template.
 *
 *       Templates already being used by active performance reviews
 *       may not be eligible for deletion.
 *
 *     tags:
 *       - Performance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance template ID
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Template deleted Successfully
 *
 *       400:
 *         description: Invalid template ID
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /performance/review:
 *   get:
 *     summary: Get my performance reviews
 *     description: |
 *       Returns all performance reviews assigned to the authenticated user.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Performance reviews fetched successfully
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
 *                   example: My reviews fetched successfully
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
 * /performance/review/{reviewId}:
 *   get:
 *     summary: Get my review tasks
 *     description: |
 *       Returns all review tasks assigned to the authenticated user for a specific performance review.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance review ID
 *
 *     responses:
 *       200:
 *         description: Review tasks fetched successfully
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
 *                   example: My review tasks fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       400:
 *         description: Invalid review ID
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /performance/review/instance:
 *   get:
 *     summary: Get all review instances
 *     description: |
 *       Returns all review instances available to the authenticated user.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Review instances fetched successfully
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
 *                   example: All review instances fetched successfully
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
 * /performance/review/{reviewId}:
 *   get:
 *     summary: Get my review tasks
 *     description: |
 *       Returns all review tasks assigned to the authenticated user for a specific performance review.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance review ID
 *
 *     responses:
 *       200:
 *         description: Review tasks fetched successfully
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
 *                   example: My review tasks fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       400:
 *         description: Invalid review ID
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /performance/review/instance:
 *   get:
 *     summary: Get all review instances
 *     description: |
 *       Returns all review instances available to the authenticated user.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Review instances fetched successfully
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
 *                   example: All review instances fetched successfully
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
 * /performance/review/{reviewId}:
 *   patch:
 *     summary: Close a performance review
 *     description: |
 *       Closes a performance review after all review tasks have been completed.
 *     tags:
 *       - Performance Reviews
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performance review ID
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDraft:
 *                 type: boolean
 *                 example: false
 *               overallComment:
 *                 type: string
 *                 example: Overall performance exceeded expectations.
 *               scores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     reviewNodeId:
 *                       type: string
 *                       format: uuid
 *                       example: "8d2bb72d-18cf-430b-a12c-93307e52d5fd"
 *                     score:
 *                       type: number
 *                       example: 4.5
 *                     comment:
 *                       type: string
 *                       example: Excellent communication skills.
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: Quarterly KPI Report
 *                     documentType:
 *                       type: string
 *                       example: PERFORMANCE_EVIDENCE
 *                     originalFileName:
 *                       type: string
 *                       example: kpi-report.pdf
 *                     mimeType:
 *                       type: string
 *                       example: application/pdf
 *                     storageKey:
 *                       type: string
 *                       example: performance/reviews/kpi-report.pdf
 *
 *     responses:
 *       200:
 *         description: Performance review closed successfully
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
 *                   example: Performance review Closed Successfully
 *                 data:
 *                   type: object
 *
 *       400:
 *         description: Invalid review ID or validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Review not found
 */