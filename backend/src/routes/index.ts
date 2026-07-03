import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { validatePrinterToken } from '../middleware/validatePrinterToken.js';
import {
  uploadPhoto,
  getJobStatus,
  downloadImage,
  downloadJobImage,
  getPrinterStatus,
  getPrinterQueue,
  healthCheck,
} from '../controllers/photo.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many uploads, please try again later' },
});

export const photoRoutes = Router();

photoRoutes.post('/photos', uploadLimiter, upload.single('image'), uploadPhoto);
photoRoutes.get('/photos/:jobId', getJobStatus);
photoRoutes.get('/photos/:jobId/image', validatePrinterToken, downloadJobImage);
photoRoutes.get('/photos/download/:filename', validatePrinterToken, downloadImage);

export const statusRoutes = Router();

statusRoutes.get('/printer/status', getPrinterStatus);
statusRoutes.get('/printer/queue', getPrinterQueue);
statusRoutes.get('/health', healthCheck);
