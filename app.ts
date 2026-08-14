

import  express from "express";
import helmet from  "helmet";
import morgan from  "morgan";
import swaggerUi from "swagger-ui-express";
import cors from  "cors";
import "dotenv/config"
import authRouter from "./src/modules/auth/auth.routes.js";
import employeeRouter from "./src/modules/employee/employee.routes.js";
import departmentRouter from "./src/modules/department/department.routes.js";
import employmentHistoryRouter from "./src/modules/employmentHistory/employmentHistory.routes.js";
import disciplinaryRouter from "./src/modules/disciplinary/disciplinary.routes.js";
import offerLetterRouter from "./src/modules/offerLetter/offer_letter.routes.js";
import onboardingTemplateRouter from "./src/modules/onboardingTemplate/onboardingTemplate.routes.js";
import onboardingRouter from "./src/modules/preOnboarding/preOnboarding.routes.js";
import postOnboardingRouter from "./src/modules/postOnboarding/postOnboarding.routes.js";
import jobRequisitionsRouter from "./src/modules/jobRequisitions/jobRequisitions.routes.js";
import jobCreationRouter from "./src/modules/jobCreation/jobCreation.routes.js";
import jobApplicationRouter from "./src/modules/jobApplication/jobApplication.routes.js";
import leaveApplicationRouter from "./src/modules/leaveApplication/leaveApplication.routes.js";
import documentUploadRouter from "./src/modules/s3FilesUploads/s3.files.routes.js";
import payrollComponentRouter from "./src/modules/employeeBenefits/employeeBenefits.routes.js";
import companyDebtRouter from "./src/modules/companyDebts/companyDebts.routes.js";
import performanceRouter from "./src/modules/performance/performance.routes.js";
import systemSettingsRouter from "./src/modules/system_settings/system_settings.routes.js";
import { swaggerSpec } from "./src/config/swagger.js";
import { errorMiddleware } from "./src/shared/middleware/error.middleware.js";

const app = express();

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/", (req , res ) => {
    res.send("Welcome to 360 degrees");
})


app.use("/api/v1/docs" , 
    swaggerUi.serve, swaggerUi.setup(swaggerSpec)
);


app.use("/api/v1/auth" ,authRouter )
app.use("/api/v1/employees" ,employeeRouter )
app.use("/api/v1/departments" ,departmentRouter )
app.use("/api/v1/employment-history" ,employmentHistoryRouter )
app.use("/api/v1/disciplinary" , disciplinaryRouter )
app.use("/api/v1/offer-letter" , offerLetterRouter )
app.use("/api/v1/onboarding-template" , onboardingTemplateRouter )
app.use("/api/v1/onboarding", onboardingRouter)
app.use("/api/v1/document-upload" , documentUploadRouter)
app.use("/api/v1/onboarding-task" , postOnboardingRouter)
app.use("/api/v1/requisitions" , jobRequisitionsRouter)
app.use("/api/v1/recruitment" , jobCreationRouter)
app.use("/api/v1/job-applications" , jobApplicationRouter)
app.use("/api/v1/leave-applications" , leaveApplicationRouter)
app.use("/api/v1/company-debts" , companyDebtRouter)
app.use("/api/v1/payroll-components" , payrollComponentRouter)
app.use("/api/v1/performance" , performanceRouter)
app.use("/api/v1/system-settings" , performanceRouter)




app.use(errorMiddleware)


export default app;

