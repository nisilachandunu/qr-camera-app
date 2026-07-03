import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 2;

export async function compressImage(blob: Blob): Promise<Blob> {
  const file = new File([blob], 'polaroid.png', { type: blob.type || 'image/png' });

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 1500,
    useWebWorker: true,
    fileType: 'image/png',
    initialQuality: 0.92,
  });

  if (compressed.size <= blob.size) {
    return compressed;
  }

  const jpegCompressed = await imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 1500,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.9,
  });

  return jpegCompressed;
}
