
/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateDepartmentInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: Engineering
 *         description:
 *           type: string
 *           example: Handles all software engineering operations
 *         parentDepartmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: 9e4f2f6a-7d14-4a9d-91a1-bf2f0d3e12ab
 *         headEmployeeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: 7d55b8d2-c1ef-4f7f-8f3d-30f10f4c6b11
 *
 *     UpdateDepartmentInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Product Engineering
 *         description:
 *           type: string
 *           example: Updated department description
 *         parentDepartmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         headEmployeeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *           example: ACTIVE
 *
 *     DepartmentHead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *
 *     ParentDepartment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *
 *     DepartmentEmployee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         jobTitle:
 *           type: string
 *           nullable: true
 *
 *     Department:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *         parentDepartment:
 *           $ref: '#/components/schemas/ParentDepartment'
 *         headEmployee:
 *           $ref: '#/components/schemas/DepartmentHead'
 *         employeeCount:
 *           type: integer
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SingleDepartment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *         parentDepartment:
 *           $ref: '#/components/schemas/ParentDepartment'
 *         subDepartments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - INACTIVE
 *         headEmployee:
 *           $ref: '#/components/schemas/DepartmentHead'
 *         employeeCount:
 *           type: integer
 *         employees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DepartmentEmployee'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     DepartmentTree:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *         parentDepartmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         employees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DepartmentEmployee'
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DepartmentTree'
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: You Are Not Authorized To Do This
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Department not found
 *
 *     ConflictError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Department already exists
 */

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     description: Only HR_ADMIN users can create departments.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentInput'
 *     responses:
 *       201:
 *         description: Department created successfully
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
 *                   example: Department Created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Department already exists
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       HR_ADMIN can view all company departments.
 *       MANAGER can only view departments they head.
 *     responses:
 *       200:
 *         description: Departments fetched successfully
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
 *                   example: Departments fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /departments/{departmentId}:
 *   get:
 *     summary: Get single department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department fetched successfully
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
 *                   example: Department fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/SingleDepartment'
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /departments/{departmentId}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     description: Only HR_ADMIN can update departments.
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentInput'
 *     responses:
 *       200:
 *         description: Department updated successfully
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
 *                   example: Department Updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/SingleDepartment'
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /departments/{departmentId}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Soft deletes a department.
 *       Department cannot be deleted if employees are assigned to it.
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department deleted successfully
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
 *                   example: Department Updated successfully
 *                 data:
 *                   type: object
 *       409:
 *         description: Cannot delete department with assigned employees
 *       404:
 *         description: Department not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /departments/company/tree:
 *   get:
 *     summary: Get department hierarchy tree
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all company departments as a nested hierarchical tree structure.
 *     responses:
 *       200:
 *         description: Department tree fetched successfully
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
 *                   example: Department Tree fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DepartmentTree'
 *       401:
 *         description: Unauthorized
 */