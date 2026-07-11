import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  printerClientToken: process.env.PRINTER_CLIENT_TOKEN ?? 'change-me-to-a-strong-random-secret',
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR ?? './uploads'),
  dataDir: path.resolve(rootDir, './data'),
  jobsFile: path.resolve(rootDir, './data/jobs.json'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880', 10),
  baseUrl:
    process.env.BASE_URL ??
    (process.env.WEBSITE_HOSTNAME ? `https://${process.env.WEBSITE_HOSTNAME}` : 'http://localhost:3001'),
  heartbeatTimeoutMs: 60_000,
};
