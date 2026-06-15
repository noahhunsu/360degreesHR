/**
 * @swagger
 * /offer-letter/template/upload-url:
 *   post:
 *     summary: Generate presigned URL for uploading offer letter template
 *     description: Generates a secure upload URL (S3 or similar) for uploading an offer letter template.
 *     tags:
 *       - Offer Letters
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - mimeType
 *               - documentType
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: offer_template.pdf
 *               mimeType:
 *                 type: string
 *                 example: application/pdf
 *               documentType:
 *                 type: string
 *                 example: OFFER_TEMPLATE
 *
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
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
 *                   example: Upload url generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadUrl:
 *                       type: string
 *                     storageKey:
 *                       type: string
 *
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /offer-letter/upload-template:
 *   post:
 *     summary: Save uploaded offer letter template metadata
 *     description: Stores offer letter template metadata after file has been uploaded to storage.
 *     tags:
 *       - Offer Letters
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storageKey
 *               - fileName
 *               - mimeType
 *               - documentType
 *             properties:
 *               storageKey:
 *                 type: string
 *                 example: offer-templates/uuid-file.pdf
 *               fileName:
 *                 type: string
 *                 example: offer_template.pdf
 *               mimeType:
 *                 type: string
 *                 example: application/pdf
 *               documentType:
 *                 type: string
 *                 example: OFFER_TEMPLATE
 *
 *     responses:
 *       201:
 *         description: Offer letter template uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storageKey:
 *                       type: string
 *                     fileName:
 *                       type: string
 *
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /offer-letter/get-template:
 *   get:
 *     summary: Get offer letter template details
 *     description: Retrieves the stored offer letter template metadata for the company.
 *     tags:
 *       - Offer Letters
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Offer letter template fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     storageKey:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *                     documentType:
 *                       type: string
 *
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 */

/**
 * @swagger
 * /offer-letter/download-template:
 *   get:
 *     summary: Generate download URL for offer letter template
 *     description: Returns a secure signed URL to download the offer letter template from storage.
 *     tags:
 *       - Offer Letters
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Download URL generated successfully
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
 *                   example: Download URL generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     downloadUrl:
 *                       type: string
 *                       example: https://s3.amazonaws.com/...
 *
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 */