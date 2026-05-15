
/**
 * @swagger
 * tags:
 *   name: Disciplinary Records
 *   description: Employee disciplinary management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateDisciplinaryInput:
 *       type: object
 *       required:
 *         - type
 *         - severity
 *         - title
 *         - description
 *       properties:
 *         type:
 *           type: string
 *           enum:
 *             - WARNING
 *             - MISCONDUCT
 *             - ABSENTEEISM
 *             - INSUBORDINATION
 *             - HARASSMENT
 *             - POLICY_VIOLATION
 *           example: MISCONDUCT
 *         severity:
 *           type: string
 *           enum:
 *             - LOW
 *             - MEDIUM
 *             - HIGH
 *             - CRITICAL
 *           example: HIGH
 *         title:
 *           type: string
 *           example: Repeated Late Attendance
 *         description:
 *           type: string
 *           example: Employee has repeatedly arrived late to work over the last 2 weeks.
 *
 *     ResolveDisciplinaryInput:
 *       type: object
 *       required:
 *         - resolutionNotes
 *       properties:
 *         resolutionNotes:
 *           type: string
 *           example: Employee has completed disciplinary counseling and issue has been resolved.
 *
 *     DisciplinaryEmployee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         employeeCode:
 *           type: string
 *           example: EMP-001
 *
 *     DisciplinaryUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *
 *     DisciplinaryRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *         employeeId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum:
 *             - WARNING
 *             - MISCONDUCT
 *             - ABSENTEEISM
 *             - INSUBORDINATION
 *             - HARASSMENT
 *             - POLICY_VIOLATION
 *         severity:
 *           type: string
 *           enum:
 *             - LOW
 *             - MEDIUM
 *             - HIGH
 *             - CRITICAL
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - RESOLVED
 *           example: PENDING
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         resolutionNotes:
 *           type: string
 *           nullable: true
 *         resolvedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         employee:
 *           $ref: '#/components/schemas/DisciplinaryEmployee'
 *         createdBy:
 *           $ref: '#/components/schemas/DisciplinaryUser'
 *         resolvedBy:
 *           allOf:
 *             - $ref: '#/components/schemas/DisciplinaryUser'
 *           nullable: true
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: You are not authorized to do this
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *           example: Employee not found
 *
 *     ConflictError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *           example: Disciplinary record already resolved
 */

/**
 * @swagger
 * /disciplinary/employees/{employeeId}:
 *   post:
 *     summary: Create disciplinary record
 *     tags: [Disciplinary Records]
 *     security:
 *       - bearerAuth: []
 *     description: Only HR_ADMIN users can create disciplinary records.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDisciplinaryInput'
 *     responses:
 *       201:
 *         description: Disciplinary record created successfully
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
 *                   example: Disciplinary Record Created successfully
 *                 data:
 *                   $ref: '#/components/schemas/DisciplinaryRecord'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /disciplinary/employees/{employeeId}:
 *   get:
 *     summary: Get employee disciplinary records
 *     tags: [Disciplinary Records]
 *     security:
 *       - bearerAuth: []
 *     description: Fetch all disciplinary records belonging to a specific employee.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Disciplinary records fetched successfully
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
 *                   example: Disciplinary Record Fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DisciplinaryRecord'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /disciplinary/employees/{disciplinaryId}:
 *   patch:
 *     summary: Resolve disciplinary record
 *     tags: [Disciplinary Records]
 *     security:
 *       - bearerAuth: []
 *     description: Mark a disciplinary record as resolved.
 *     parameters:
 *       - in: path
 *         name: disciplinaryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Disciplinary Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResolveDisciplinaryInput'
 *     responses:
 *       201:
 *         description: Disciplinary record resolved successfully
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
 *                   example: Disciplinary Record Resolved successfully
 *                 data:
 *                   $ref: '#/components/schemas/DisciplinaryRecord'
 *       400:
 *         description: Record already resolved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Disciplinary record not found
 */