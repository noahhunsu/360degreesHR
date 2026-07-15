import { Router } from "express";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { addPayrollBreakdownSchema, attachEmployeeComponentSchema, createPayrollComponentSchema, editPayrollSnapshotSchema, removeEmployeeComponentSchema, removePayrollBreakdownSchema, runPayrollSchema, updateEmployeeComponentSchema, updatePayrollComponentSchema } from "./employeeBenefits.validation.js";
import { PayrollComponentManagementController } from "./employeeBenefits.controller.js";




const router = Router()

router.post("/payroll-component/create" , parseAuthHeaderMiddleware() , validate(createPayrollComponentSchema) , PayrollComponentManagementController.createPayrollComponentController)
router.patch("/payroll-component/:payrollComponentId"  , parseAuthHeaderMiddleware() , validate(updatePayrollComponentSchema) , PayrollComponentManagementController.updatePayrollComponentController)
router.patch("/payroll-component/:payrollComponentId/delete" , parseAuthHeaderMiddleware() , PayrollComponentManagementController.deletePayrollComponentServiceController)
router.get("/payroll-component/:payrollComponentId" , parseAuthHeaderMiddleware() , PayrollComponentManagementController.getSinglePayrollComponentController)
router.get("/payroll-component" , parseAuthHeaderMiddleware() , PayrollComponentManagementController.getAllPayrollComponentsController)
router.get("/employee-benefits/:employeeId", parseAuthHeaderMiddleware(), PayrollComponentManagementController.getEmployeeComponentController)
router.post("/employee-benefits/:employeeId/attach" , parseAuthHeaderMiddleware(), validate(attachEmployeeComponentSchema),PayrollComponentManagementController.attachComponentController)
router.patch("/employee-benefits/:employeeId/update" , parseAuthHeaderMiddleware(), validate(updateEmployeeComponentSchema),PayrollComponentManagementController.updateEmployeeComponentsController)
router.patch("/employee-benefits/:employeeId/remove" , parseAuthHeaderMiddleware(), validate(removeEmployeeComponentSchema),PayrollComponentManagementController.removeEmployeeComponentsController)

// payroll
router.post("/payroll/run" , parseAuthHeaderMiddleware() , validate(runPayrollSchema) , PayrollComponentManagementController.runPayrollForMonthController)
router.patch("/payroll/lock/:payrollId" , parseAuthHeaderMiddleware() , PayrollComponentManagementController.lockPayrollController)
router.patch("/payroll/mark/:payrollId" , parseAuthHeaderMiddleware() , PayrollComponentManagementController.markPayrollAsPaidController)
router.patch("/payroll/update/:breakdownId" , parseAuthHeaderMiddleware() , validate(editPayrollSnapshotSchema) ,PayrollComponentManagementController.editPayrollSnapshotController)
// router.patch("/payroll/add/:payrollItemId" , parseAuthHeaderMiddleware() , validate(addPayrollBreakdownSchema),PayrollComponentManagementController.addPayrollBreakdownController)
router.patch("/payroll/remove/:payrollItemId" , parseAuthHeaderMiddleware() , validate(removePayrollBreakdownSchema),PayrollComponentManagementController.removePayrollBreakdownController)
router.get("/payroll/run" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getAllPayrollRunsController)
router.get("/payroll/run/:payrollId" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getSinglePayrollRunsController)
router.get("/payroll/payroll-item/employee/:employeeId" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getAllEmployeePayrollItemController)
router.get("/payroll/payroll-item/:payrollItemId/employee/:employeeId/" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getSingleEmployeePayrollItemController)
router.get("/payroll/:payrollRunId" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getPayrollSummaryController)
router.delete("/payroll/:payrollRunId" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.deletePayrollRunController)
router.get("/payroll/:employeeId/summary" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getEmployeePayrollHistoryController)
router.get("/payroll/payslip/my" , parseAuthHeaderMiddleware() ,PayrollComponentManagementController.getMyPayslipController)

export default router