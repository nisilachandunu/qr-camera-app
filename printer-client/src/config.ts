import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:3001',
  printerClientToken: process.env.PRINTER_CLIENT_TOKEN ?? 'change-me-to-a-strong-random-secret',
  printerId: process.env.PRINTER_ID ?? 'venue-selphy-1',
  printerName: process.env.PRINTER_NAME ?? '',
  tempDir: path.resolve(__dirname, '../temp'),
};
