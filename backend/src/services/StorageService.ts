import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';

export interface IStorageService {
  save(buffer: Buffer, originalName: string): Promise<string>;
  getAbsolutePath(relativePath: string): string;
  getStream(relativePath: string): Promise<Buffer>;
  exists(relativePath: string): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  async ensureDir(): Promise<void> {
    await fs.mkdir(config.uploadDir, { recursive: true });
  }

  async save(buffer: Buffer, originalName: string): Promise<string> {
    await this.ensureDir();
    const ext = path.extname(originalName) || '.png';
    const filename = `${uuidv4()}${ext}`;
    const relativePath = filename;
    const absolutePath = path.join(config.uploadDir, filename);
    await fs.writeFile(absolutePath, buffer);
    return relativePath;
  }

  getAbsolutePath(relativePath: string): string {
    return path.join(config.uploadDir, relativePath);
  }

  async getStream(relativePath: string): Promise<Buffer> {
    const absolutePath = this.getAbsolutePath(relativePath);
    return fs.readFile(absolutePath);
  }

  async exists(relativePath: string): Promise<boolean> {
    try {
      await fs.access(this.getAbsolutePath(relativePath));
      return true;
    } catch {
      return false;
    }
  }
}

// CloudStorageService can be implemented later for S3/Azure Blob swap
export const storageService = new LocalStorageService();
