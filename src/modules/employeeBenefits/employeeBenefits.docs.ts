/**
 * @swagger
 * /payroll-components/payroll-component/create:
 *   post:
 *     summary: Create payroll component
 *     description: Creates a new payroll component such as Basic Salary, Tax, Bonus, Pension, or any custom earning/deduction component.
 *
 *     tags:
 *       - Payroll Components
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePayrollComponentRequest'
 *
 *     responses:
 *       201:
 *         description: Payroll component created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /payroll-components/payroll-component/{payrollComponentId}:
 *   patch:
 *     summary: Update payroll component
 *     description: Updates an existing payroll component.
 *
 *     tags:
 *       - Payroll Components
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: payrollComponentId
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
 *             $ref: '#/components/schemas/UpdatePayrollComponentRequest'
 *
 *     responses:
 *       200:
 *         description: Payroll component updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Payroll component not found
 */

/**
 * @swagger
 * /payroll-components/payroll-component/{payrollComponentId}/delete:
 *   patch:
 *     summary: Delete payroll component
 *     description: Soft deletes a payroll component.
 *
 *     tags:
 *       - Payroll Components
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: payrollComponentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Payroll component deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Payroll component not found
 */

/**
 * @swagger
 * /payroll-components/payroll-component/{payrollComponentId}:
 *   get:
 *     summary: Get payroll component
 *     description: Retrieves a payroll component by its ID.
 *
 *     tags:
 *       - Payroll Components
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: payrollComponentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Payroll component retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Payroll component not found
 */

/**
 * @swagger
 * /payroll-components/payroll-component:
 *   get:
 *     summary: Get all payroll components
 *     description: Retrieves all payroll components for the company.
 *
 *     tags:
 *       - Payroll Components
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Payroll components retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payroll-components/employee-benefits/{employeeId}:
 *   get:
 *     summary: Get employee payroll components
 *     description: Retrieves all payroll components currently attached to an employee.
 *
 *     tags:
 *       - Employee Payroll Components
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
 *       200:
 *         description: Employee payroll components retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /payroll-components/employee-benefits/{employeeId}/attach:
 *   post:
 *     summary: Attach payroll components to employee
 *     description: Assigns one or more payroll components to an employee.
 *
 *     tags:
 *       - Employee Payroll Components
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
 *             $ref: '#/components/schemas/AttachEmployeeComponentRequest'
 *
 *     responses:
 *       201:
 *         description: Payroll components attached successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /payroll-components/employee-benefits/{employeeId}/update:
 *   patch:
 *     summary: Update employee payroll components
 *     description: Updates payroll component values assigned to an employee.
 *
 *     tags:
 *       - Employee Payroll Components
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
 *             $ref: '#/components/schemas/UpdateEmployeeComponentRequest'
 *
 *     responses:
 *       200:
 *         description: Employee payroll components updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payroll-components/employee-benefits/{employeeId}/remove:
 *   patch:
 *     summary: Remove payroll components from employee
 *     description: Removes one or more payroll components from an employee.
 *
 *     tags:
 *       - Employee Payroll Components
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
 *             $ref: '#/components/schemas/RemoveEmployeeComponentRequest'
 *
 *     responses:
 *       200:
 *         description: Employee payroll components removed successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 */

