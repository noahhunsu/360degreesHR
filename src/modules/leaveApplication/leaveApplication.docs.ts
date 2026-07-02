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

/**
 * @swagger
 * /leave-applications/leave-balance/employee/{employeeId}/{leaveTypeId}:
 *   post:
 *     summary: Assign or update employee leave balance
 *     description: |
 *       Creates or updates an employee's leave balance for a specific leave type.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *       The endpoint:
 *       - validates employee existence
 *       - validates leave type existence
 *       - creates a new balance if one does not exist
 *       - updates the allocated leave days if a balance already exists
 *
 *     tags:
 *       - Leave Management
 *
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
 *             $ref: '#/components/schemas/CreateOrUpdateEmployeeLeaveBalanceRequest'
 *
 *           examples:
 *             assignBalance:
 *               summary: Assign leave balance
 *               value:
 *                 allocatedDays: 25
 *
 *     responses:
 *       200:
 *         description: Leave balance updated successfully
 *
 *       201:
 *         description: Leave balance created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Employee or leave type not found
 */
/**
 * @swagger
 * /leave-applications/leave-request/{leaveTypeId}/create:
 *   post:
 *     summary: Submit a leave request
 *     description: |
 *       Allows an employee to submit a new leave request.
 *
 *       The endpoint:
 *       - validates the selected leave type
 *       - validates leave dates
 *       - checks leave balance
 *       - validates supporting documents if required
 *       - creates a pending leave request
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
 *             $ref: '#/components/schemas/CreateLeaveRequest'
 *
 *           examples:
 *             annualLeave:
 *               summary: Annual leave request
 *               value:
 *                 startDate: "2026-08-01T00:00:00.000Z"
 *                 endDate: "2026-08-10T00:00:00.000Z"
 *                 reliever: "c57aeb0e-c2a2-4a2c-99db-8c0ef3fd2dcb"
 *                 documents:
 *                   - fileName: "medical-report.pdf"
 *                     storageKey: "leave-documents/report.pdf"
 *                     mimeType: "application/pdf"
 *
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *
 *       400:
 *         description: Validation error or insufficient leave balance
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Leave type not found
 */

/**
 * @swagger
 * /leave-applications/leave-request/{leaveRequestId}/cancel:
 *   patch:
 *     summary: Cancel a leave request
 *     description: |
 *       Allows an employee to cancel a previously submitted leave request.
 *
 *       The endpoint:
 *       - validates leave request existence
 *       - ensures the employee owns the request
 *       - verifies cancellation is allowed
 *       - restores leave balance where applicable
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveRequestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Leave request cancelled successfully
 *
 *       400:
 *         description: Leave request cannot be cancelled
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Leave request not found
 */

/**
 * @swagger
 * /leave-applications/leave-request/{leaveRequestId}/reject:
 *   patch:
 *     summary: Reject a leave request
 *     description: |
 *       Rejects a pending leave request.
 *
 *       Only authorized approvers can perform this action.
 *
 *       The endpoint:
 *       - validates leave request existence
 *       - ensures the request is pending
 *       - records the rejection reason
 *       - updates the leave request status
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveRequestId
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
 *             $ref: '#/components/schemas/RejectLeaveRequest'
 *
 *           examples:
 *             rejected:
 *               value:
 *                 reason: "Project deadline requires your availability."
 *
 *     responses:
 *       200:
 *         description: Leave request rejected successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Leave request not found
 */

/**
 * @swagger
 * /leave-applications/leave-request/{leaveRequestId}/approve:
 *   patch:
 *     summary: Approve a leave request
 *     description: |
 *       Approves a pending leave request.
 *
 *       Only authorized approvers can approve leave applications.
 *
 *       The endpoint:
 *       - validates leave request existence
 *       - ensures the request is pending
 *       - deducts leave balance
 *       - updates the request status
 *       - stores the optional approval comment
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveRequestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveLeaveRequest'
 *
 *           examples:
 *             approved:
 *               value:
 *                 comment: "Approved. Have a great vacation."
 *
 *     responses:
 *       200:
 *         description: Leave request approved successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Leave request not found
 */

/**
 * @swagger
 * /leave-applications/leave-policy:
 *   get:
 *     summary: Get leave policy
 *     description: |
 *       Retrieves the company's leave policy configuration.
 *
 *       Only authenticated users can access this endpoint.
 *
 *       The response includes:
 *       - weekend exclusion settings
 *       - public holiday settings
 *       - working days
 *       - notice period
 *       - carry forward rules
 *       - probation rules
 *       - cancellation settings
 *       - leave encashment settings
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Leave policy retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Leave policy not found
 */

/**
 * @swagger
 * /leave-applications/leave-policy/create:
 *   post:
 *     summary: Create leave policy
 *     description: |
 *       Creates the company's leave policy.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *       This endpoint configures:
 *       - working days
 *       - notice periods
 *       - leave carry forward
 *       - probation rules
 *       - cancellation rules
 *       - leave encashment
 *       - negative balance settings
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
 *             $ref: '#/components/schemas/LeavePolicyRequest'
 *
 *           examples:
 *             defaultPolicy:
 *               summary: Company leave policy
 *               value:
 *                 excludeWeekends: true
 *                 excludePublicHolidays: true
 *                 workingDays:
 *                   - MONDAY
 *                   - TUESDAY
 *                   - WEDNESDAY
 *                   - THURSDAY
 *                   - FRIDAY
 *                 minimumMonthsBeforeLeave: 3
 *                 minimumNoticeDays: 7
 *                 allowCarryForward: true
 *                 maxCarryForwardDays: 10
 *                 allowNegativeBalance: false
 *                 allowLeaveEncashment: false
 *                 allowEmployeeCancellation: true
 *                 cancellationNoticeDays: 2
 *                 allowHalfDayLeave: true
 *                 allowLeaveDuringProbation: false
 *
 *     responses:
 *       201:
 *         description: Leave policy created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR_ADMIN can create leave policy
 *
 *       409:
 *         description: Leave policy already exists
 */

/**
 * @swagger
 * /leave-applications/leave-policy/update:
 *   patch:
 *     summary: Update leave policy
 *     description: |
 *       Updates the company's leave policy.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *       All fields are optional.
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
 *             $ref: '#/components/schemas/LeavePolicyRequest'
 *
 *           examples:
 *             updatePolicy:
 *               summary: Update leave policy
 *               value:
 *                 minimumNoticeDays: 14
 *                 allowCarryForward: true
 *                 maxCarryForwardDays: 15
 *                 allowLeaveEncashment: true
 *
 *     responses:
 *       200:
 *         description: Leave policy updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR_ADMIN can update leave policy
 *
 *       404:
 *         description: Leave policy not found
 */

/**
 * @swagger
 * /leave-applications/create-holiday/create:
 *   post:
 *     summary: Create public holidays
 *     description: |
 *       Creates one or more public holidays for the company.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *       Multiple holidays can be created in a single request.
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
 *             $ref: '#/components/schemas/CreatePublicHolidayRequest'
 *
 *           examples:
 *             holidays:
 *               summary: Create holidays
 *               value:
 *                 holidays:
 *                   - name: "New Year's Day"
 *                     date: "2026-01-01T00:00:00.000Z"
 *                   - name: "Workers Day"
 *                     date: "2026-05-01T00:00:00.000Z"
 *
 *     responses:
 *       201:
 *         description: Public holidays created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR_ADMIN can create holidays
 */

/**
 * @swagger
 * /leave-applications/create-holiday/{holidayId}/update:
 *   patch:
 *     summary: Update public holiday
 *     description: |
 *       Updates a company's public holiday.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: holidayId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Public holiday ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePublicHolidayRequest'
 *
 *           examples:
 *             updateHoliday:
 *               summary: Update holiday
 *               value:
 *                 name: "Independence Day"
 *                 date: "2026-10-01T00:00:00.000Z"
 *
 *     responses:
 *       200:
 *         description: Public holiday updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR_ADMIN can update holidays
 *
 *       404:
 *         description: Holiday not found
 */

/**
 * @swagger
 * /leave-applications/create-holiday/{holidayId}:
 *   delete:
 *     summary: Delete public holiday
 *     description: |
 *       Deletes a company public holiday.
 *
 *       Only HR_ADMIN users can perform this operation.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: holidayId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Public holiday ID
 *
 *     responses:
 *       200:
 *         description: Public holiday deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Only HR_ADMIN can delete public holidays
 *
 *       404:
 *         description: Public holiday not found
 */

/**
 * @swagger
 * /leave-applications/upload/upload-url:
 *   post:
 *     summary: Generate upload URL for leave application document
 *     description: |
 *       Generates a pre-signed upload URL for documents attached to a leave application.
 *
 *       Only authenticated users can access this endpoint.
 *
 *       The generated URL should be used to upload the file directly to cloud storage.
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
 *             $ref: '#/components/schemas/GetPresignedUrlForLeaveApplicationRequest'
 *
 *           examples:
 *             uploadDocument:
 *               summary: Generate upload URL
 *               value:
 *                 fileName: "medical-report.pdf"
 *                 mimeType: "application/pdf"
 *                 documentType: "Medical Certificate"
 *
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /leave-applications/{leaveRequestId}/document/{documentId}:
 *   get:
 *     summary: View leave application document
 *     description: |
 *       Retrieves a document that was submitted as part of a leave application.
 *
 *       Only authenticated users with permission to access the leave request can view the document.
 *
 *     tags:
 *       - Leave Management
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: leaveRequestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Leave request ID
 *
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Leave application document ID
 *
 *     responses:
 *       200:
 *         description: Leave application document retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: You do not have permission to access this document
 *
 *       404:
 *         description: Leave request or document not found
 */