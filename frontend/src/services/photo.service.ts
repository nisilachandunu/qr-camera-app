import axios, { type AxiosError } from 'axios';
import type { JobStatusResponse, UploadPhotoResponse } from '../types';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (typeof error.config & { _retryCount?: number }) | undefined;
    if (!config) return Promise.reject(error);

    const isNetworkError = !error.response;
    const retryCount = config._retryCount ?? 0;

    if (isNetworkError && retryCount < 2) {
      config._retryCount = retryCount + 1;
      await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
      return api(config);
    }

    return Promise.reject(error);
  },
);

export async function uploadPhoto(blob: Blob): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append('image', blob, 'polaroid.png');

  const { data } = await api.post<UploadPhotoResponse>('/api/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const { data } = await api.get<JobStatusResponse>(`/api/photos/${jobId}`);
  return data;
}

export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

export default api;
