
import { Router } from "express";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { S3FilesController } from "./s3.files.controller.js";
import { createPresignedUrl } from "./s3.files.validation.js";



const router = Router()

router.post("/upload-url" ,  validate(createPresignedUrl), S3FilesController.generatePresignedUrlController)


export default router