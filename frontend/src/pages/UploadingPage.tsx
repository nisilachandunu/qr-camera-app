import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useUploadPhoto } from '../hooks/useUploadPhoto';
import { isNetworkError } from '../services/photo.service';
import { weddingConfig } from '../config/wedding.config';
import type { LocationState } from '../types';

export function UploadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { uploadAsync } = useUploadPhoto();

  useEffect(() => {
    if (!state?.polaroidBlob) {
      navigate('/camera', { replace: true });
      return;
    }

    const doUpload = async () => {
      try {
        const result = await uploadAsync(state.polaroidBlob!);
        navigate('/success', {
          state: { jobId: result.jobId, polaroidUrl: state.polaroidUrl },
          replace: true,
        });
      } catch (err) {
        navigate('/error', {
          state: {
            type: isNetworkError(err) ? 'network' : 'upload_failed',
          },
          replace: true,
        });
      }
    };

    void doUpload();
  }, [state, uploadAsync, navigate]);

  return <LoadingOverlay message={weddingConfig.uploadingText} />;
}
