import express from 'express';
import { convertPdfController, extractTextController } from '../controllers/pdfController.js';

const router = express.Router();

/**
 * POST /api/pdf/convert
 * Converte um PDF em base64 para uma imagem em base64
 *
 * Body:
 * {
 *   "pdfBase64": "string (base64 do PDF)",
 *   "pageNumber": number (opcional, padrão: 1),
 *   "scale": number (opcional, padrão: 2.0)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "imageBase64": "data:image/png;base64,...",
 *   "message": "PDF convertido com sucesso"
 * }
 */
router.post('/convert', convertPdfController);

/**
 * POST /api/pdf/extract-text
 * Extrai o texto de um PDF em base64
 *
 * Body:
 * {
 *   "pdfBase64": "string (base64 do PDF)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "text": "string (texto extraído)",
 *   "numPages": number,
 *   "info": object,
 *   "metadata": object,
 *   "message": "Texto extraído com sucesso"
 * }
 */
router.post('/extract-text', extractTextController);

export default router;
