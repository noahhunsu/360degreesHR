

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee
 *     description: |
 *       Creates a new employee and corresponding user account.
 *
 *       Only users with the HR_ADMIN role can access this endpoint.
 *
 *       The endpoint:
 *       - validates employee email uniqueness
 *       - validates manager existence and role
 *       - validates department existence
 *       - generates a unique employee code
 *       - creates both User and Employee records in a transaction
 *       - sends onboarding email after successful creation
 *
 *     tags:
 *       - Employees
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *
 *           examples:
 *             employee:
 *               summary: Employee creation payload
 *               value:
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@360degrees.com"
 *                 password: "SecurePass123"
 *                 phone: "+2348012345678"
 *                 gender: "MALE"
 *                 dateOfBirth: "1998-05-20T00:00:00.000Z"
 *                 address: "Lagos, Nigeria"
 *                 jobTitle: "Backend Engineer"
 *                 employmentType: "FULL_TIME"
 *                 departmentId: "7e1f9d42-8c5e-4c5f-91e1-73ffbcb7db31"
 *                 managerId: "df84cbb0-50f7-4d74-a7d3-f2d26e4f315d"
 *                 hireDate: "2026-05-13T00:00:00.000Z"
 *
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateEmployeeResponse'
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *
 *       403:
 *         description: Forbidden - Only HR_ADMIN can create employees
 *
 *       404:
 *         description: Department or manager not found
 *
 *       409:
 *         description: Email already exists OR selected employee is not a manager
 */


/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     description: |
 *       Returns a paginated list of employees within the authenticated user's company.
 *
 *       Access behavior depends on role:
 *
 *       - HR_ADMIN → can view all employees in company
 *       - MANAGER → can only view employees assigned to them
 *       - EMPLOYEE → can only view their own employee profile
 *
 *       Supports:
 *       - pagination
 *       - search by first name or last name
 *       - nested relations (department, manager, user)
 *
 *     tags:
 *       - Employees
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Current pagination page
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of employees per page
 *
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Search employee by first name or last name
 *
 *     responses:
 *
 *       200:
 *         description: Employees fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetAllEmployeesResponse'
 *
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *
 *       403:
 *         description: Forbidden - Access denied
 */

/**
 * @swagger
 * /employees/{employeeId}:
 *   get:
 *     summary: Get single employee
 *     description: |
 *       Retrieve a single employee within the authenticated user's company.
 *
 *       Access Rules:
 *       - HR_ADMIN → Can view any employee in company
 *       - MANAGER → Can only view employees under them
 *       - EMPLOYEE → Can only view their own profile
 *
 *     tags:
 *       - Employees
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
 *         description: Employee ID
 *
 *     responses:
 *
 *       200:
 *         description: Employee fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Employee fetched successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *
 *                     id:
 *                       type: string
 *                       format: uuid
 *
 *                     employeeCode:
 *                       type: string
 *                       example: EMP-0001
 *
 *                     firstName:
 *                       type: string
 *                       example: Arthur
 *
 *                     lastName:
 *                       type: string
 *                       example: Chima
 *
 *                     gender:
 *                       type: string
 *                       enum:
 *                         - MALE
 *                         - FEMALE
 *
 *                     jobTitle:
 *                       type: string
 *                       example: Backend Engineer
 *
 *                     employmentStatus:
 *                       type: string
 *                       enum:
 *                         - ACTIVE
 *                         - INACTIVE
 *                         - SUSPENDED
 *                         - TERMINATED
 *
 *                     department:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *
 *                         name:
 *                           type: string
 *                           example: Engineering
 *
 *                     manager:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *
 *                         firstName:
 *                           type: string
 *                           example: John
 *
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *
 *                     subordinates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *
 *                           firstName:
 *                             type: string
 *                             example: Jane
 *
 *                           lastName:
 *                             type: string
 *                             example: Smith
 *
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: arthur@example.com
 *
 *                         role:
 *                           type: string
 *                           enum:
 *                             - HR_ADMIN
 *                             - MANAGER
 *                             - EMPLOYEE
 *
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *
 *       400:
 *         description: Invalid employee ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Invalid employee ID
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
 *
 *                 message:
 *                   type: string
 *                   examples:
 *                     unauthorized:
 *                       value: You Are Not Authorized To Do This
 *
 *                     managerMissing:
 *                       value: Manager profile not found
 *
 *                     employeeMissing:
 *                       value: Employee profile not found
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Employee not found
 */


/**
 * 
 * 
 * @swagger
 * /employees/{employeeId}:
 *   put:
 *     summary: Update employee
 *     description: |
 *       Update an existing employee record.
 *
 *       Only HR_ADMIN users can update employees.
 *
 *       This endpoint updates both:
 *       - Employee table fields
 *       - Related User account fields
 *
 *       Password updates are automatically hashed before storage.
 *
 *     tags:
 *       - Employees
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
 *         description: Employee ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeInput'
 *
 *     responses:
 *
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Employee updated successfully
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     employee:
 *                       $ref: '#/components/schemas/Employee'
 *
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Invalid employee ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Invalid employee ID
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: You Are Not Authorized To Do This
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *
 *       409:
 *         description: Conflict error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *
 *                   examples:
 *                     emailExists:
 *                       value: Email already exists
 */

/**
 * @swagger
 * /employees/{employeeId}:
 *   delete:
 *     summary: Delete employee
 *     description: |
 *       Soft deletes an employee from the system.
 *
 *       Only HR_ADMIN users can delete employees.
 *
 *       This operation:
 *       - Sets employee.deletedAt
 *       - Changes employmentStatus to TERMINATED
 *       - Disables login access by setting user.isActive to false
 *
 *       The employee record is NOT permanently removed from the database.
 *
 *       HR_ADMIN users cannot delete themselves.
 *
 *     tags:
 *       - Employees
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
 *         description: Employee ID
 *
 *     responses:
 *
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Employee Deleted Successfully
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     success:
 *                       type: boolean
 *                       example: true
 *
 *                     message:
 *                       type: string
 *                       example: Employee deleted successfully
 *
 *       400:
 *         description: Invalid employee ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Invalid employee ID
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: You Are Not Authorized To Do This
 *
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *
 *       409:
 *         description: Conflict error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *
 *                   examples:
 *                     selfDelete:
 *                       value: You cannot delete yourself
 */

/**
 * @swagger
 * /employees/bulk-uploads:
 *   post:
 *     summary: Bulk create employees from spreadsheet
 *     description: |
 *       Upload an Excel spreadsheet (.xlsx or .xls) containing employee records.
 *
 *       Required columns:
 *       - firstName
 *       - lastName
 *       - email
 *       - gender
 *
 *       Optional columns:
 *       - phone
 *       - dateOfBirth
 *       - address
 *       - jobTitle
 *       - employmentType
 *       - departmentId
 *       - managerId
 *       - hireDate
 *
 *       Any unknown columns are ignored.
 *
 *       Rows that fail validation are skipped and returned in the failedRows array.
 *
 *     tags:
 *       - Employees
 *
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
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel spreadsheet (.xlsx or .xls)
 *
 *     responses:
 *       201:
 *         description: Bulk upload processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Employees processed successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRows:
 *                       type: integer
 *                       example: 10
 *
 *                     successful:
 *                       type: integer
 *                       example: 8
 *
 *                     failed:
 *                       type: integer
 *                       example: 2
 *
 *                     successfulRows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                             example: 2
 *
 *                           employeeId:
 *                             type: string
 *                             example: 5f7f4a71-f278-4c82-9f4d-8c7fcdd1dcb3
 *
 *                           email:
 *                             type: string
 *                             example: john.doe@example.com
 *
 *                     failedRows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                             example: 4
 *
 *                           reason:
 *                             type: string
 *                             example: Email already exists
 *
 *       400:
 *         description: Invalid spreadsheet or validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /employees/bulk-upload/template:
 *   get:
 *     summary: Download employee bulk upload template
 *     description: Downloads an Excel template that HR administrators can use to prepare employee bulk upload data.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Excel template downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /employees/bulk-uploads:
 *   post:
 *     summary: Bulk create employees from spreadsheet
 *     description: Upload an Excel spreadsheet containing employee records for bulk employee creation.
 *     tags:
 *       - Employees
 *
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
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel (.xlsx) spreadsheet containing employee records
 *
 *     responses:
 *       201:
 *         description: Employees created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Employee Created successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRows:
 *                       type: integer
 *                       example: 25
 *
 *                     successful:
 *                       type: integer
 *                       example: 23
 *
 *                     failed:
 *                       type: integer
 *                       example: 2
 *
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                             example: 4
 *
 *                           message:
 *                             type: string
 *                             example: Email already exists
 *
 *       400:
 *         description: Spreadsheet file is required
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       422:
 *         description: Invalid spreadsheet format
 *
 *       500:
 *         description: Internal server error
 */