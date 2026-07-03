import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraError } from '../types';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isReady: boolean;
  error: CameraError | null;
  devices: MediaDeviceInfo[];
  hasMultipleCameras: boolean;
  start: () => Promise<void>;
  stop: () => void;
  switchCamera: () => Promise<void>;
  capture: () => Promise<Blob | null>;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const deviceIdRef = useRef<string | undefined>(undefined);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setIsReady(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const enumerateCameras = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      return videoDevices;
    } catch {
      return [];
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    stop();

    if (!navigator.mediaDevices?.getUserMedia) {
      setError({ type: 'no_camera', message: 'Camera is not supported on this device.' });
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: deviceIdRef.current ? undefined : 'user',
          deviceId: deviceIdRef.current ? { exact: deviceIdRef.current } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsReady(true);
      await enumerateCameras();
    } catch (err) {
      const domError = err as DOMException;
      if (domError.name === 'NotAllowedError' || domError.name === 'PermissionDeniedError') {
        setError({
          type: 'camera_denied',
          message: 'Camera access was denied. Please allow camera access in your browser settings.',
        });
      } else if (domError.name === 'NotFoundError' || domError.name === 'DevicesNotFoundError') {
        setError({ type: 'no_camera', message: 'No camera found on this device.' });
      } else {
        setError({ type: 'unknown', message: 'Could not access the camera. Please try again.' });
      }
    }
  }, [stop, enumerateCameras]);

  const switchCamera = useCallback(async () => {
    const videoDevices = devices.length > 0 ? devices : await enumerateCameras();
    if (videoDevices.length < 2) return;

    const currentIndex = videoDevices.findIndex((d) => d.deviceId === deviceIdRef.current);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex];
    if (nextDevice) {
      deviceIdRef.current = nextDevice.deviceId;
      await start();
    }
  }, [devices, enumerateCameras, start]);

  const capture = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || !isReady) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const isFrontCamera = !deviceIdRef.current;
    if (isFrontCamera) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
    });
  }, [isReady]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    stream,
    isReady,
    error,
    devices,
    hasMultipleCameras: devices.length > 1,
    start,
    stop,
    switchCamera,
    capture,
  };
}
