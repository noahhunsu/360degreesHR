-- ============================================================
-- 360DEGREES HR
-- SYSTEM PERMISSIONS
-- ============================================================
--
-- These are the system-wide permissions available for companies
-- to assign to their custom roles.
--
-- Permission names are referenced by the backend authorization
-- middleware, e.g.
--
-- requiredPermission(["create_employee"])
--
-- Do not casually rename existing permission names because they
-- become part of the application's authorization contract.
-- ============================================================


INSERT INTO "permissions" ("id" ,"name", "description")
VALUES

-- ============================================================
-- EMPLOYEE MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_employee',
 'Create a new employee'),

(gen_random_uuid() , 'view_employee',
 'View employee information'),

(gen_random_uuid() , 'update_employee',
 'Update employee information'),

(gen_random_uuid() , 'delete_employee',
 'Delete an employee'),

(gen_random_uuid() , 'restore_employee',
 'Restore a deleted employee'),


-- ============================================================
-- EMPLOYEE ONBOARDING
-- ============================================================

(gen_random_uuid() , 'create_onboarding_invitation',
 'Create and send an employee onboarding invitation'),

(gen_random_uuid() , 'view_onboarding_invitation',
 'View employee onboarding invitations'),

(gen_random_uuid() , 'cancel_onboarding_invitation',
 'Cancel an employee onboarding invitation'),

(gen_random_uuid() , 'resend_onboarding_invitation',
 'Resend an employee onboarding invitation'),

(gen_random_uuid() , 'view_onboarding_submission',
 'View employee onboarding submissions'),

(gen_random_uuid() , 'approve_onboarding_submission',
 'Approve an employee onboarding submission'),

(gen_random_uuid() , 'reject_onboarding_submission',
 'Reject an employee onboarding submission'),


-- ============================================================
-- EMPLOYEE PROFILE
-- ============================================================

(gen_random_uuid() , 'view_employee_profile',
 'View detailed employee profile information'),

(gen_random_uuid() , 'update_employee_profile',
 'Update employee profile information'),

(gen_random_uuid() , 'view_employee_contact',
 'View employee contact information'),

(gen_random_uuid() , 'update_employee_contact',
 'Update employee contact information'),


-- ============================================================
-- EMPLOYMENT LIFECYCLE
-- ============================================================

(gen_random_uuid() , 'view_employment_history',
 'View employee employment history'),

(gen_random_uuid() , 'create_employment_history',
 'Create an employment history record'),

(gen_random_uuid() , 'update_employment_history',
 'Update an employment history record'),

(gen_random_uuid() , 'delete_employment_history',
 'Delete an employment history record'),

(gen_random_uuid() , 'update_employee_status',
 'Update employee employment status'),

(gen_random_uuid() , 'terminate_employee',
 'Terminate an employee'),

(gen_random_uuid() , 'reactivate_employee',
 'Reactivate an employee'),


-- ============================================================
-- DEPARTMENTS / ORGANIZATION
-- ============================================================

(gen_random_uuid() , 'create_department',
 'Create a department'),

(gen_random_uuid() , 'view_department',
 'View departments'),

(gen_random_uuid() , 'update_department',
 'Update a department'),

(gen_random_uuid() , 'delete_department',
 'Delete a department'),


-- ============================================================
-- EMPLOYEE DOCUMENTS
-- ============================================================

(gen_random_uuid() , 'upload_employee_document',
 'Upload an employee document'),

(gen_random_uuid() , 'view_employee_document',
 'View employee documents'),

(gen_random_uuid() , 'update_employee_document',
 'Update employee document information'),

(gen_random_uuid() , 'delete_employee_document',
 'Delete an employee document'),


-- ============================================================
-- PAYROLL COMPONENTS
-- ============================================================

(gen_random_uuid() , 'create_payroll_component',
 'Create a payroll component'),

(gen_random_uuid() , 'view_payroll_component',
 'View payroll components'),

(gen_random_uuid() , 'update_payroll_component',
 'Update a payroll component'),

(gen_random_uuid() , 'delete_payroll_component',
 'Delete a payroll component'),


-- ============================================================
-- EMPLOYEE BENEFITS / COMPENSATION
-- ============================================================

(gen_random_uuid() , 'view_employee_compensation',
 'View employee compensation'),

(gen_random_uuid() , 'attach_employee_compensation',
 'Attach a payroll component to an employee'),

(gen_random_uuid() , 'update_employee_compensation',
 'Update employee compensation'),

(gen_random_uuid() , 'remove_employee_compensation',
 'Remove employee compensation'),

(gen_random_uuid() , 'view_employee_benefit',
 'View employee benefits'),

(gen_random_uuid() , 'create_employee_benefit',
 'Create an employee benefit'),

(gen_random_uuid() , 'update_employee_benefit',
 'Update an employee benefit'),

(gen_random_uuid() , 'remove_employee_benefit',
 'Remove an employee benefit'),


-- ============================================================
-- PAYROLL RUNS
-- ============================================================

(gen_random_uuid() , 'create_payroll_run',
 'Create and execute a payroll run'),

(gen_random_uuid() , 'view_payroll_run',
 'View payroll runs'),

(gen_random_uuid() , 'view_payroll_item',
 'View individual employee payroll results'),

(gen_random_uuid() , 'update_payroll_run',
 'Update a payroll run'),

(gen_random_uuid() , 'delete_payroll_run',
 'Delete a payroll run'),

(gen_random_uuid() , 'lock_payroll_run',
 'Lock a payroll run'),

(gen_random_uuid() , 'unlock_payroll_run',
 'Unlock a payroll run'),

(gen_random_uuid() , 'approve_payroll_run',
 'Approve a payroll run'),

(gen_random_uuid() , 'reject_payroll_run',
 'Reject a payroll run'),

(gen_random_uuid() , 'mark_payroll_as_paid',
 'Mark a payroll run as paid'),


-- ============================================================
-- SALARY ADVANCE
-- ============================================================

(gen_random_uuid() , 'create_salary_advance',
 'Create a salary advance request'),

(gen_random_uuid() , 'view_salary_advance',
 'View salary advance requests'),

(gen_random_uuid() , 'update_salary_advance',
 'Update a salary advance request'),

(gen_random_uuid() , 'delete_salary_advance',
 'Delete a salary advance request'),

(gen_random_uuid() , 'approve_salary_advance',
 'Approve a salary advance request'),

(gen_random_uuid() , 'reject_salary_advance',
 'Reject a salary advance request'),

(gen_random_uuid() , 'cancel_salary_advance',
 'Cancel a salary advance request'),


-- ============================================================
-- LEAVE MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_leave_policy',
 'Create a leave policy'),

(gen_random_uuid() , 'view_leave_policy',
 'View leave policies'),

(gen_random_uuid() , 'update_leave_policy',
 'Update a leave policy'),

(gen_random_uuid() , 'delete_leave_policy',
 'Delete a leave policy'),

(gen_random_uuid() , 'create_leave_request',
 'Create a leave request'),

(gen_random_uuid() , 'view_leave_request',
 'View leave requests'),

(gen_random_uuid() , 'update_leave_request',
 'Update a leave request'),

(gen_random_uuid() , 'cancel_leave_request',
 'Cancel a leave request'),

(gen_random_uuid() , 'approve_leave_request',
 'Approve a leave request'),

(gen_random_uuid() , 'reject_leave_request',
 'Reject a leave request'),


-- ============================================================
-- ATTENDANCE
-- ============================================================

(gen_random_uuid() , 'view_attendance',
 'View attendance records'),

(gen_random_uuid() , 'create_attendance',
 'Create an attendance record'),

(gen_random_uuid() , 'update_attendance',
 'Update an attendance record'),

(gen_random_uuid() , 'delete_attendance',
 'Delete an attendance record'),

(gen_random_uuid() , 'approve_attendance_adjustment',
 'Approve an attendance adjustment'),


-- ============================================================
-- PERFORMANCE MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_performance_template',
 'Create a performance review template'),

(gen_random_uuid() , 'view_performance_template',
 'View performance review templates'),

(gen_random_uuid() , 'update_performance_template',
 'Update a performance review template'),

(gen_random_uuid() , 'delete_performance_template',
 'Delete a performance review template'),

(gen_random_uuid() , 'create_performance_review',
 'Create a performance review'),

(gen_random_uuid() , 'view_performance_review',
 'View performance reviews'),

(gen_random_uuid() , 'update_performance_review',
 'Update a performance review'),

(gen_random_uuid() , 'delete_performance_review',
 'Delete a performance review'),

(gen_random_uuid() , 'submit_performance_review',
 'Submit a performance review'),

(gen_random_uuid() , 'approve_performance_review',
 'Approve a performance review'),

(gen_random_uuid() , 'reject_performance_review',
 'Reject a performance review'),


-- ============================================================
-- DISCIPLINARY MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_disciplinary_record',
 'Create a disciplinary record'),

(gen_random_uuid() , 'view_disciplinary_record',
 'View disciplinary records'),

(gen_random_uuid() , 'update_disciplinary_record',
 'Update a disciplinary record'),

(gen_random_uuid() , 'delete_disciplinary_record',
 'Delete a disciplinary record'),


-- ============================================================
-- USER MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_user',
 'Create a company user'),

(gen_random_uuid() , 'view_user',
 'View company users'),

(gen_random_uuid() , 'update_user',
 'Update a company user'),

(gen_random_uuid() , 'delete_user',
 'Delete a company user'),


-- ============================================================
-- ROLE MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'create_role',
 'Create a company role'),

(gen_random_uuid() , 'view_role',
 'View company roles'),

(gen_random_uuid() , 'update_role',
 'Update a company role'),

(gen_random_uuid() , 'delete_role',
 'Delete a company role'),

(gen_random_uuid() , 'assign_role_to_user',
 'Assign a role to a user'),

(gen_random_uuid() , 'remove_role_from_user',
 'Remove a role from a user'),


-- ============================================================
-- PERMISSION MANAGEMENT
-- ============================================================

(gen_random_uuid() , 'view_permission',
 'View the available system permissions'),

(gen_random_uuid() , 'assign_permission_to_role',
 'Assign a permission to a role'),

(gen_random_uuid() , 'remove_permission_from_role',
 'Remove a permission from a role'),

(gen_random_uuid() , 'update_role_permissions',
 'Update permissions assigned to a role'),


-- ============================================================
-- COMPANY SETTINGS
-- ============================================================

(gen_random_uuid() , 'view_company',
 'View company information'),

(gen_random_uuid() , 'update_company',
 'Update company information'),


-- ============================================================
-- ACCOUNT / PROFILE
-- ============================================================

(gen_random_uuid() , 'view_own_profile',
 'View own profile'),

(gen_random_uuid() , 'update_own_profile',
 'Update own profile'),

(gen_random_uuid() , 'change_own_password',
 'Change own password'),


-- ============================================================
-- REPORTING
-- ============================================================

(gen_random_uuid() , 'view_employee_reports',
 'View employee reports'),

(gen_random_uuid() , 'view_payroll_reports',
 'View payroll reports'),

(gen_random_uuid() , 'view_attendance_reports',
 'View attendance reports'),

(gen_random_uuid() , 'view_leave_reports',
 'View leave reports'),

(gen_random_uuid() , 'view_performance_reports',
 'View performance reports'),

(gen_random_uuid() , 'view_company_reports',
 'View company reports')


ON CONFLICT ("name") DO NOTHING;