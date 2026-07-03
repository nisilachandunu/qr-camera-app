import type { Request, Response, NextFunction } from 'express';
import { photoService } from '../services/PhotoService.js';
import { printQueueService } from '../services/PrintQueueService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError(400, 'No image file provided');
    }

    const job = await photoService.uploadPhoto(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    res.status(201).json({
      jobId: job.id,
      status: job.status,
    });
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(500, (err as Error).message));
  }
}

export async function getJobStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobId = String(req.params.jobId ?? '');
    const job = photoService.getJob(jobId);
    if (!job) {
      throw new AppError(404, 'Job not found');
    }
    res.json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      error: job.error,
    });
  } catch (err) {
    next(err);
  }
}

export async function downloadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filename = String(req.params.filename ?? '');
    const buffer = await photoService.getImageBuffer(filename);
    const ext = filename.split('.').pop()?.toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    res.setHeader('Content-Type', mime);
    res.send(buffer);
  } catch (err) {
    next(new AppError(404, 'Image not found'));
  }
}

export async function downloadJobImage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const jobId = String(req.params.jobId ?? '');
    const job = photoService.getJob(jobId);
    if (!job) {
      throw new AppError(404, 'Job not found');
    }
    const buffer = await photoService.getImageBuffer(job.imagePath);
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(404, 'Image not found'));
  }
}

export async function getPrinterStatus(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { printerConnectionService } = await import('../services/PrinterConnectionService.js');
    const printer = printerConnectionService.getFirstConnected();
    res.json({
      connected: printerConnectionService.isConnected(),
      printerId: printer?.printerId ?? null,
      printerName: printer?.printerName ?? null,
      queueLength: printQueueService.getQueueLength(),
      currentJob: printQueueService.getCurrentJob(),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPrinterQueue(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json({
      queue: printQueueService.getAllJobs().filter(
        (j) => j.status === 'queued' || j.status === 'assigned' || j.status === 'printing',
      ),
    });
  } catch (err) {
    next(err);
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
