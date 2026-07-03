import { useCallback, useEffect, useRef, useState } from 'react';
import { generatePolaroid } from '../utils/generatePolaroid';
import type { PolaroidConfig } from '../config/polaroid.config';

interface UsePolaroidReturn {
  polaroidUrl: string | null;
  polaroidBlob: Blob | null;
  isGenerating: boolean;
  error: string | null;
  generate: (source: Blob) => Promise<Blob | null>;
  revoke: () => void;
}

export function usePolaroid(config?: Partial<PolaroidConfig>): UsePolaroidReturn {
  const [polaroidUrl, setPolaroidUrl] = useState<string | null>(null);
  const [polaroidBlob, setPolaroidBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const revoke = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPolaroidUrl(null);
    setPolaroidBlob(null);
  }, []);

  const generate = useCallback(
    async (source: Blob): Promise<Blob | null> => {
      setIsGenerating(true);
      setError(null);
      revoke();

      try {
        const blob = await generatePolaroid(source, config);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setPolaroidUrl(url);
        setPolaroidBlob(blob);
        return blob;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate Polaroid';
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [config, revoke],
  );

  useEffect(() => {
    return () => revoke();
  }, [revoke]);

  return { polaroidUrl, polaroidBlob, isGenerating, error, generate, revoke };
}
