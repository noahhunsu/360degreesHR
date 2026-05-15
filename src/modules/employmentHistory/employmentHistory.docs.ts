/**
 * @swagger
 * tags:
 *   name: Employment History
 *   description: Employee employment history management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateEmploymentHistoryRequest:
 *       type: object
 *       required:
 *         - jobTitle
 *         - startDate
 *       properties:
 *         departmentId:
 *           type: string
 *           format: uuid
 *           example: "c2dfc2f8-4d57-4cb8-8d8c-94ef6d4fd2cb"
 *
 *         jobTitle:
 *           type: string
 *           example: "Senior Backend Engineer"
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-01-10T00:00:00.000Z"
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2027-01-10T00:00:00.000Z"
 *
 *         isCurrent:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     EmploymentHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *
 *         employeeId:
 *           type: string
 *           format: uuid
 *
 *         companyId:
 *           type: string
 *           format: uuid
 *
 *         departmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *         jobTitle:
 *           type: string
 *           example: "Senior Backend Engineer"
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         isCurrent:
 *           type: boolean
 *           example: true
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     EmploymentHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: "Employee History Created successfully"
 *
 *         data:
 *           $ref: "#/components/schemas/EmploymentHistory"
 *
 *     EmploymentHistoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: "Employee History Created successfully"
 *
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EmploymentHistory"
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: "You Are Not Authorized To Do This"
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: "Validation Error"
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: "Employee not found"
 */

/**
 * @swagger
 * /employment-history/employees/{employeeId}:
 *
 *   post:
 *     summary: Create employment history
 *     description: |
 *       Creates a new employment history record for an employee.
 *
 *       Only HR_ADMIN users can create employment history records.
 *
 *       If isCurrent is true, the current active employment history
 *       will automatically be closed.
 *     tags:
 *       - Employment History
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateEmploymentHistoryRequest"
 *
 *     responses:
 *
 *       201:
 *         description: Employment history created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmploymentHistoryResponse"
 *
 *       400:
 *         description: Validation error or invalid employee ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *
 *
 *   get:
 *     summary: Get employee employment history
 *     description: |
 *       Fetch all employment history records belonging to a specific employee.
 *
 *       Only HR_ADMIN users can access this endpoint.
 *     tags:
 *       - Employment History
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
 *     responses:
 *
 *       200:
 *         description: Employment history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmploymentHistoryListResponse"
 *
 *       400:
 *         description: Invalid employee ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnauthorizedError"
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 */