import type { PrinterInfo } from '../types/print-job.js';

export class PrinterConnectionService {
  private printers: Map<string, PrinterInfo> = new Map();

  register(socketId: string, printerId: string, printerName: string): PrinterInfo {
    const info: PrinterInfo = {
      printerId,
      printerName,
      socketId,
      connectedAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
    };
    this.printers.set(printerId, info);
    return info;
  }

  unregisterBySocket(socketId: string): PrinterInfo | null {
    for (const [id, info] of this.printers) {
      if (info.socketId === socketId) {
        this.printers.delete(id);
        return info;
      }
    }
    return null;
  }

  heartbeat(printerId: string): void {
    const info = this.printers.get(printerId);
    if (info) {
      info.lastHeartbeat = new Date().toISOString();
    }
  }

  getPrinter(printerId: string): PrinterInfo | undefined {
    return this.printers.get(printerId);
  }

  getFirstConnected(): PrinterInfo | undefined {
    return this.printers.values().next().value;
  }

  isConnected(): boolean {
    return this.printers.size > 0;
  }

  getConnectedPrinters(): PrinterInfo[] {
    return [...this.printers.values()];
  }

  getSocketId(printerId: string): string | undefined {
    return this.printers.get(printerId)?.socketId;
  }
}

export const printerConnectionService = new PrinterConnectionService();
