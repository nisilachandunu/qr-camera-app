import type { Server as HttpServer } from 'http';
import { Server, type Socket } from 'socket.io';
import { config } from '../config/index.js';
import { printQueueService } from './PrintQueueService.js';
import { printerConnectionService } from './PrinterConnectionService.js';
import type { JobAssignPayload, QueueStatusPayload } from '../types/print-job.js';

export class SocketService {
  private io: Server | null = null;

  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.frontendUrl,
        methods: ['GET', 'POST'],
      },
    });

    const printerNamespace = this.io.of('/printer');

    printerNamespace.use((socket, next) => {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token || token !== config.printerClientToken) {
        return next(new Error('Unauthorized'));
      }
      next();
    });

    printerNamespace.on('connection', (socket) => {
      this.handlePrinterConnection(socket, printerNamespace);
    });
  }

  private handlePrinterConnection(
    socket: Socket,
    namespace: ReturnType<Server['of']>,
  ): void {
    let registeredPrinterId: string | null = null;

    socket.on('printer:register', async (data: { printerId: string; printerName: string }) => {
      const { printerId, printerName } = data;
      printerConnectionService.register(socket.id, printerId, printerName);
      registeredPrinterId = printerId;

      const status: QueueStatusPayload = {
        queueLength: printQueueService.getQueueLength(),
        currentJob: printQueueService.getCurrentJob(),
        connected: true,
      };
      socket.emit('queue:status', status);

      await this.tryAssignNextJob(namespace);
    });

    socket.on('job:started', async (data: { jobId: string }) => {
      await printQueueService.startPrinting(data.jobId);
    });

    socket.on('job:completed', async (data: { jobId: string }) => {
      await printQueueService.completeJob(data.jobId);
      await this.tryAssignNextJob(namespace);
    });

    socket.on('job:failed', async (data: { jobId: string; error: string }) => {
      await printQueueService.failJob(data.jobId, data.error);
      await this.tryAssignNextJob(namespace);
    });

    socket.on('heartbeat', () => {
      if (registeredPrinterId) {
        printerConnectionService.heartbeat(registeredPrinterId);
      }
    });

    socket.on('disconnect', async () => {
      const printer = printerConnectionService.unregisterBySocket(socket.id);
      if (printer) {
        await printQueueService.revertActiveToQueued();
      }
    });
  }

  async tryAssignNextJob(namespace?: ReturnType<Server['of']>): Promise<void> {
    const ns = namespace ?? this.io?.of('/printer');
    if (!ns) return;

    const printer = printerConnectionService.getFirstConnected();
    if (!printer) return;

    const nextJob = await printQueueService.peekNextJob();
    if (!nextJob) return;

    const assigned = await printQueueService.assignJob(nextJob.id, printer.printerId);
    if (!assigned) return;

    const payload: JobAssignPayload = {
      jobId: assigned.id,
      imageUrl: assigned.imageUrl,
      createdAt: assigned.createdAt,
    };

    const socketId = printerConnectionService.getSocketId(printer.printerId);
    if (socketId) {
      ns.to(socketId).emit('job:assign', payload);
    }
  }

  async notifyNewJob(): Promise<void> {
    await this.tryAssignNextJob();
  }
}

export const socketService = new SocketService();
