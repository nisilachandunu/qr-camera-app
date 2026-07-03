import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';

export async function downloadImage(imageUrl: string, jobId: string): Promise<string> {
  await fs.mkdir(config.tempDir, { recursive: true });
  const outputPath = path.join(config.tempDir, `${jobId}.png`);

  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
    headers: {
      'X-Printer-Token': config.printerClientToken,
    },
    timeout: 30_000,
  });

  await fs.writeFile(outputPath, Buffer.from(response.data));
  return outputPath;
}

export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore cleanup errors
  }
}
