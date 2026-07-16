import { Router } from "express";
import { parseAuthHeaderMiddleware } from "./companyDebts.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { LoansAndAdvanceController } from "./companyDebts.controller.js";
import { approveOrRejectSalaryAdvanceRequestSchema, confirmPaidSalaryAdvanceRequestSchema, createSalaryAdvanceSchema } from "./companyDebts.validation.js";




const router = Router()


router.post("/salary-advance/create" , parseAuthHeaderMiddleware() ,validate(createSalaryAdvanceSchema) ,LoansAndAdvanceController.createSalaryAdvanceController)
router.patch("/salary-advance/:salaryAdvanceId" , parseAuthHeaderMiddleware() ,validate(createSalaryAdvanceSchema),  LoansAndAdvanceController.updateSalaryAdvanceController)
router.patch("/salary-advance/:salaryAdvanceId/cancel" , parseAuthHeaderMiddleware() ,  LoansAndAdvanceController.cancelSalaryAdvanceController)
router.get("/salary-advance" , parseAuthHeaderMiddleware() , LoansAndAdvanceController.getAllSalaryAdvanceRequestController)
router.get("/salary-advance/:salaryAdvanceId", parseAuthHeaderMiddleware() , LoansAndAdvanceController.getSingleSalaryAdvanceRequestController)
router.patch("/salary-advance/:salaryAdvanceId/review", parseAuthHeaderMiddleware() , validate(approveOrRejectSalaryAdvanceRequestSchema) , LoansAndAdvanceController.approveOrRejectSalaryAdvanceRequestController)
router.patch("/salary-advance/:salaryAdvanceId/mark-as-paid" ,  parseAuthHeaderMiddleware() , validate(confirmPaidSalaryAdvanceRequestSchema) ,LoansAndAdvanceController.confirmPaidSalaryAdvanceRequestController)


export default router