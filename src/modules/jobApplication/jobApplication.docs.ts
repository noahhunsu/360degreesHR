/**
 * @swagger
 * /onboarding-task/template:
 *   post:
 *     summary: Create onboarding task template
 *     tags:
 *       - Onboarding Task
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
 *               - title
 *               - responsibility
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete Employee Handbook Review
 *               description:
 *                 type: string
 *                 example: Employee must review and acknowledge handbook
 *               responsibility:
 *                 type: string
 *                 enum:
 *                   - EMPLOYEE
 *                   - MANAGER
 *                   - HR_ADMIN
 *                   - SPECIFIC_USER
 *               assignedUserId:
 *                 type: string
 *                 format: uuid
 *                 example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *
 *     responses:
 *       201:
 *         description: Onboarding task template created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-task/template:
 *   get:
 *     summary: Get onboarding task templates
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Onboarding task templates fetched successfully
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
 * /onboarding-task/template/{templateId}/deactivate:
 *   patch:
 *     summary: Deactivate onboarding task template
 *     tags:
 *       - Onboarding Task
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
 *         description: Onboarding task template deactivated successfully
 *       400:
 *         description: Invalid template ID
 *       404:
 *         description: Template not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-task/task/{employeeId}:
 *   post:
 *     summary: Assign onboarding task to employee
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: employeeId
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
 *               - onboardingTaskTemplateId
 *             properties:
 *               onboardingTaskTemplateId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *
 *     responses:
 *       201:
 *         description: Onboarding task created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Employee or template not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-task/task/me:
 *   get:
 *     summary: Get current user's onboarding tasks
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Onboarding tasks fetched successfully
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
 * /onboarding-task/task/{taskId}/start:
 *   patch:
 *     summary: Start onboarding task
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Onboarding task started successfully
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /onboarding-task/task/{taskId}/complete:
 *   patch:
 *     summary: Complete onboarding task
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Onboarding task completed successfully
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /onboarding-task/task/{employeeId}/incomplete:
 *   get:
 *     summary: Get incomplete onboarding tasks for an employee
 *     tags:
 *       - Onboarding Task
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Incomplete onboarding tasks fetched successfully
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
 *       400:
 *         description: Invalid employee ID
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */


