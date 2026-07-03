export type PrintJobStatus = 'queued' | 'assigned' | 'printing' | 'completed' | 'failed';

export interface UploadPhotoResponse {
  jobId: string;
  status: PrintJobStatus;
}

export interface JobStatusResponse {
  jobId: string;
  status: PrintJobStatus;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export type ErrorType =
  | 'camera_denied'
  | 'no_camera'
  | 'upload_failed'
  | 'network'
  | 'polaroid_failed'
  | 'unknown';

export interface LocationState {
  capturedBlob?: Blob;
  polaroidBlob?: Blob;
  polaroidUrl?: string;
  jobId?: string;
}

export interface CameraError {
  type: ErrorType;
  message: string;
}
