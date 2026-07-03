import { useMutation } from '@tanstack/react-query';
import { uploadPhoto, isNetworkError } from '../services/photo.service';
import { compressImage } from '../utils/compressImage';
import type { UploadPhotoResponse } from '../types';

interface UseUploadPhotoReturn {
  upload: (blob: Blob) => void;
  uploadAsync: (blob: Blob) => Promise<UploadPhotoResponse>;
  isUploading: boolean;
  error: string | null;
  jobId: string | null;
  isNetworkFailure: boolean;
  reset: () => void;
}

export function useUploadPhoto(): UseUploadPhotoReturn {
  const mutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const compressed = await compressImage(blob);
      return uploadPhoto(compressed);
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : 'Upload failed'
      : null,
    jobId: mutation.data?.jobId ?? null,
    isNetworkFailure: mutation.error ? isNetworkError(mutation.error) : false,
    reset: mutation.reset,
  };
}
