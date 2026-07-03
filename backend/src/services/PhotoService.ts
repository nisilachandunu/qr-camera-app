import { config } from '../config/index.js';
import { printQueueService } from './PrintQueueService.js';
import { storageService } from './StorageService.js';
import { socketService } from './SocketService.js';
import type { PrintJob } from '../types/print-job.js';

export class PhotoService {
  async uploadPhoto(buffer: Buffer, originalName: string, mimeType: string): Promise<PrintJob> {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(mimeType)) {
      throw new Error('Invalid file type. Only PNG and JPEG are allowed.');
    }

    if (buffer.length > config.maxFileSize) {
      throw new Error('File too large.');
    }

    const imagePath = await storageService.save(buffer, originalName);
    const imageUrl = `${config.baseUrl}/api/photos/download/${imagePath}`;

    const job = await printQueueService.createJob(imagePath, imageUrl);
    await socketService.notifyNewJob();

    return job;
  }

  getJob(jobId: string): PrintJob | undefined {
    return printQueueService.getJob(jobId);
  }

  async getImageBuffer(relativePath: string): Promise<Buffer> {
    const exists = await storageService.exists(relativePath);
    if (!exists) {
      throw new Error('Image not found');
    }
    return storageService.getStream(relativePath);
  }
}

export const photoService = new PhotoService();
