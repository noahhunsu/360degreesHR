import { Router } from "express";
import { LeaveManagementController } from "./leaveApplication.controller.js";
import { parseAuthHeaderMiddleware } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { approveLeaveRequestSchema, createLeaveRequestSchema, createLeaveTypeSchema, createOrUpdateEmployeeLeaveBalanceSchema, createPublicHolidaySchema, getPresignedUrlInputForLeaveApplicationSchema, leavePolicyInputSchema, rejectLeaveRequestSchema, updateLeaveTypeInputInputSchema, updatePublicHolidaySchema } from "./leaveApplication.validation.js";




const router = Router()

router.post("/leave-type" , parseAuthHeaderMiddleware() , validate(createLeaveTypeSchema) , LeaveManagementController.createLeaveTypeController)
router.get("/leave-type"  , parseAuthHeaderMiddleware() , LeaveManagementController.getAllLeaveTypeController)
router.get("/leave-type/:leaveTypeId" , parseAuthHeaderMiddleware() , LeaveManagementController.getSingleLeaveTypeController)
router.patch("/leave-type/:leaveTypeId" , parseAuthHeaderMiddleware() , validate(updateLeaveTypeInputInputSchema) , LeaveManagementController.updateLeaveTypeController)
router.post("/leave-balance/employee/:employeeId/:leaveTypeId" , parseAuthHeaderMiddleware() , validate(createOrUpdateEmployeeLeaveBalanceSchema) , LeaveManagementController.createOrUpdateEmployeeLeaveBalanceController)
router.get("/leave-balance/:leaveTypeId" , parseAuthHeaderMiddleware() , LeaveManagementController.getMyEmployeeBalanceController)
router.post("/leave-request/:leaveTypeId/create", parseAuthHeaderMiddleware(),validate(createLeaveRequestSchema), LeaveManagementController.createLeaveRequestController)
router.get("/leave-request/all", parseAuthHeaderMiddleware(), LeaveManagementController.getAllLeaveController)
router.get("/leave-request/single/:leaveRequestId", parseAuthHeaderMiddleware(), LeaveManagementController.getSingleLeaveRequestController)
router.patch("/leave-request/:leaveRequestId/cancel" , parseAuthHeaderMiddleware(), LeaveManagementController.cancelLeaveRequestController)
router.patch("/leave-request/:leaveRequestId/reject" , parseAuthHeaderMiddleware(), validate(rejectLeaveRequestSchema), LeaveManagementController.rejectLeaveRequestController)
router.patch("/leave-request/:leaveRequestId/approve" , parseAuthHeaderMiddleware(), validate(approveLeaveRequestSchema), LeaveManagementController.approveLeaveRequestController)
router.get("/leave-policy" , parseAuthHeaderMiddleware(),  LeaveManagementController.getLeavePolicyController)
router.post("/leave-policy/create" , parseAuthHeaderMiddleware(), validate(leavePolicyInputSchema), LeaveManagementController.createLeavePolicyController)
router.patch("/leave-policy/update" , parseAuthHeaderMiddleware(), validate(leavePolicyInputSchema), LeaveManagementController.updateLeavePolicyController)
router.get("/company-holidays" , parseAuthHeaderMiddleware(),  LeaveManagementController.getAllPublicHolidaysController)
router.get("/company-holidays/:holidayId" , parseAuthHeaderMiddleware(),  LeaveManagementController.getSinglePublicHolidaysController)
router.post("/create-holiday/create" , parseAuthHeaderMiddleware(), validate(createPublicHolidaySchema), LeaveManagementController.createPublicHolidayController)
router.patch("/create-holiday/:holidayId/update" , parseAuthHeaderMiddleware(), validate(updatePublicHolidaySchema), LeaveManagementController.updatePublicHolidayController)
router.delete("/create-holiday/:holidayId" , parseAuthHeaderMiddleware(), LeaveManagementController.deletePublicHolidayController)
router.post("/upload/upload-url" , parseAuthHeaderMiddleware(), validate(getPresignedUrlInputForLeaveApplicationSchema), LeaveManagementController.generatePresignedUrlLeaveApplicationController)
router.get("/:leaveRequestId/document/:documentId" , parseAuthHeaderMiddleware() , LeaveManagementController.leaveApplicationSubmissionDocumentViewController)

export default router
