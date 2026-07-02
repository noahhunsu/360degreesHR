/**
 * @swagger
 * /leave-applications/leave-type:
 *   post:
 *     summary: Create leave type
 *     description: |
 *       Creates a new leave type for the authenticated company.
 *
 *       Only users with the HR_ADMIN role can access this endpoint.
 *
 *       The endpoint:
 *       - validates leave type uniqueness within the company
 *       - validates approval configuration
 *       - validates document requirements
 *       - creates the leave type
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeaveTypeRequest'
 *
 *           examples:
 *             annualLeave:
 *               summary: Annual Leave
 *               value:
 *                 name: "Annual Leave"
 *                 description: "Paid annual vacation leave."
 *                 daysPerYear: 21
 *                 isPaid: true
 *                 requiresApproval: true
 *                 approvalFrom: HOD
 *                 requiresDocument: false
 *                 minimumMonthsOfService: 6
 *                 noticePeriodDays: 14
 *                 allowCarryForward: true
 *                 maxCarryForwardDays: 5
 *                 allowHalfDay: true
 *                 availableDuringProbation: false
 *
 *     responses:
 *       201:
 *         description: Leave type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveTypeResponse'
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR administrators can create leave types
 *
 *       409:
 *         description: Leave type already exists
 */


/**
 * @swagger
 * /leave-applications/leave-type:
 *   get:
 *     summary: Get all leave types
 *     description: |
 *       Returns all leave types belonging to the authenticated user's company.
 *
 *       - HR Admins receive both active and inactive leave types.
 *       - Employees receive only active leave types.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Leave types fetched successfully.
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
 *                   example: Leave Types Fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LeaveTypeResponse'
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /leave-applications/leave-type/{leaveTypeId}:
 *   get:
 *     summary: Get single leave type
 *     description: Returns a single leave type.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveTypeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Leave type fetched successfully.
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
 *                   $ref: '#/components/schemas/LeaveTypeResponse'
 *
 *       404:
 *         description: Leave type not found
 */

/**
 * @swagger
 * /leave-applications/leave-type/{leaveTypeId}:
 *   patch:
 *     summary: Update leave type
 *     description: |
 *       Updates an existing leave type.
 *
 *       Only HR Admins can update leave types.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveTypeId
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
 *             $ref: '#/components/schemas/UpdateLeaveTypeRequest'
 *
 *     responses:
 *       200:
 *         description: Leave type updated successfully.
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
 *                   $ref: '#/components/schemas/LeaveTypeResponse'
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Leave type not found
 *
 *       409:
 *         description: Leave type with the same name already exists
 */