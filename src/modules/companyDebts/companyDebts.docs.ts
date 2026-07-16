/**
 * @swagger
 * /company-debts/salary-advance/create:
 *   post:
 *     summary: Create salary advance request
 *     description: |
 *       Creates a new salary advance request for the authenticated employee.
 *
 *       The endpoint allows an employee to request a salary advance by specifying
 *       the requested amount and an optional reason.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalaryAdvanceRequest'
 *
 *     responses:
 *       201:
 *         description: Salary advance request created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /company-debts/salary-advance/{salaryAdvanceId}:
 *   patch:
 *     summary: Update salary advance request
 *     description: |
 *       Updates an existing salary advance request.
 *
 *       Only editable requests that have not yet been reviewed can be updated.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: salaryAdvanceId
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
 *             $ref: '#/components/schemas/UpdateSalaryAdvanceRequest'
 *
 *     responses:
 *       200:
 *         description: Salary advance updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Salary advance request not found
 */

/**
 * @swagger
 * /company-debts/salary-advance/{salaryAdvanceId}/cancel:
 *   patch:
 *     summary: Cancel salary advance request
 *     description: |
 *       Cancels an existing salary advance request.
 *
 *       Only pending requests can be cancelled.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: salaryAdvanceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Salary advance request cancelled successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Salary advance request not found
 */

/**
 * @swagger
 * /company-debts/salary-advance:
 *   get:
 *     summary: Get all salary advance requests
 *     description: |
 *       Retrieves all salary advance requests available to the authenticated user.
 *
 *       HR administrators may retrieve all requests, while employees only retrieve
 *       their own requests.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Salary advance requests retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /company-debts/salary-advance/{salaryAdvanceId}:
 *   get:
 *     summary: Get single salary advance request
 *     description: Retrieves details of a specific salary advance request.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: salaryAdvanceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Salary advance request retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Salary advance request not found
 */

/**
 * @swagger
 * /company-debts/salary-advance/{salaryAdvanceId}/review:
 *   patch:
 *     summary: Review salary advance request
 *     description: |
 *       Approves or rejects a salary advance request.
 *
 *       The reviewer may approve with an approved amount or reject with a reason.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: salaryAdvanceId
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
 *             $ref: '#/components/schemas/ReviewSalaryAdvanceRequest'
 *
 *     responses:
 *       200:
 *         description: Salary advance request reviewed successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Salary advance request not found
 */

/**
 * @swagger
 * /company-debts/salary-advance/{salaryAdvanceId}/mark-as-paid:
 *   patch:
 *     summary: Mark salary advance as paid
 *     description: |
 *       Marks an approved salary advance request as paid and attaches
 *       proof of payment.
 *
 *     tags:
 *       - Salary Advance
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: salaryAdvanceId
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
 *             $ref: '#/components/schemas/ConfirmPaidSalaryAdvanceRequest'
 *
 *     responses:
 *       200:
 *         description: Salary advance marked as paid successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Salary advance request not found
 */

/**
 * @swagger
 * /company-debts/upload/upload-url:
 *   post:
 *     summary: Generate upload URL for salary advance documents
 *     description: |
 *       Generates a pre-signed upload URL that can be used to upload
 *       supporting documents to cloud storage before submitting them.
 *
 *     tags:
 *       - Salary Advance
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetPresignedUrlForCompanyDebtsRequest'
 *
 *     responses:
 *       200:
 *         description: Pre-signed upload URL generated successfully
 *
 *       400:
 *         description: Validation error
 */

