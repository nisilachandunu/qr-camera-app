import { io, type Socket } from 'socket.io-client';
import chalk from 'chalk';
import { config } from './config.js';
import { downloadImage, cleanupFile } from './downloader.js';
import { printImage, listPrinters } from './print.js';

interface JobAssignPayload {
  jobId: string;
  imageUrl: string;
  createdAt: string;
}

let socket: Socket | null = null;
let isProcessing = false;
let reconnectAttempts = 0;

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
  const prefix = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    error: chalk.red,
    warn: chalk.yellow,
  };
  console.log(prefix, colors[type](message));
}

async function processJob(payload: JobAssignPayload): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;

  let filePath: string | null = null;
  try {
    log(`Received job ${payload.jobId}`, 'info');
    filePath = await downloadImage(payload.imageUrl, payload.jobId);
    log(`Downloaded image for job ${payload.jobId}`, 'success');

    socket?.emit('job:started', { jobId: payload.jobId });
    log(`Printing job ${payload.jobId}...`, 'info');

    await printImage(filePath);
    log(`Printed job ${payload.jobId} successfully`, 'success');

    socket?.emit('job:completed', { jobId: payload.jobId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    log(`Failed job ${payload.jobId}: ${message}`, 'error');
    socket?.emit('job:failed', { jobId: payload.jobId, error: message });
  } finally {
    if (filePath) await cleanupFile(filePath);
    isProcessing = false;
  }
}

function connect(): void {
  const url = `${config.backendUrl}/printer`;

  log(`Connecting to ${url}...`, 'info');

  socket = io(url, {
    auth: { token: config.printerClientToken },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30_000,
    reconnectionAttempts: Infinity,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    reconnectAttempts = 0;
    log('Connected to backend', 'success');
    socket?.emit('printer:register', {
      printerId: config.printerId,
      printerName: config.printerName || 'Default Printer',
    });
  });

  socket.on('disconnect', (reason) => {
    log(`Disconnected: ${reason}`, 'warn');
  });

  socket.on('connect_error', (err) => {
    reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** reconnectAttempts, 30_000);
    log(`Connection error: ${err.message}. Retry in ${delay}ms`, 'error');
  });

  socket.on('job:assign', (payload: JobAssignPayload) => {
    void processJob(payload);
  });

  socket.on('queue:status', (status: { queueLength: number; connected: boolean }) => {
    log(`Queue status: ${status.queueLength} job(s) pending`, 'info');
  });

  setInterval(() => {
    if (socket?.connected) {
      socket.emit('heartbeat');
    }
  }, 30_000);
}

async function main(): Promise<void> {
  log('Wedding Polaroid Printer Client', 'info');
  log(`Printer ID: ${config.printerId}`, 'info');
  log(`Backend: ${config.backendUrl}`, 'info');

  if (process.platform === 'win32') {
    try {
      const printers = await listPrinters();
      if (printers.length > 0) {
        log(`Available printers: ${printers.join(', ')}`, 'info');
        if (config.printerName && !printers.includes(config.printerName)) {
          log(`Warning: PRINTER_NAME "${config.printerName}" not found`, 'warn');
        }
      }
    } catch {
      log('Could not list printers', 'warn');
    }
  }

  connect();

  process.on('SIGINT', () => {
    log('Shutting down...', 'info');
    socket?.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
