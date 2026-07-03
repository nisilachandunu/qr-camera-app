export type PrintJobStatus = 'queued' | 'assigned' | 'printing' | 'completed' | 'failed';

export interface PrintJob {
  id: string;
  imagePath: string;
  imageUrl: string;
  status: PrintJobStatus;
  printerId?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface PrinterInfo {
  printerId: string;
  printerName: string;
  socketId: string;
  connectedAt: string;
  lastHeartbeat: string;
}

export interface JobAssignPayload {
  jobId: string;
  imageUrl: string;
  createdAt: string;
}

export interface QueueStatusPayload {
  queueLength: number;
  currentJob: PrintJob | null;
  connected: boolean;
}
