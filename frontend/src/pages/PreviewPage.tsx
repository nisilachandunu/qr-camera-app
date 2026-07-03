import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { PolaroidPreview } from '../components/PolaroidPreview';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { usePolaroid } from '../hooks/usePolaroid';
import { weddingConfig } from '../config/wedding.config';
import type { LocationState } from '../types';

export function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { polaroidUrl, polaroidBlob, isGenerating, error, generate } = usePolaroid();

  useEffect(() => {
    if (!state?.capturedBlob) {
      navigate('/camera', { replace: true });
      return;
    }
    void generate(state.capturedBlob);
  }, [state?.capturedBlob, generate, navigate]);

  useEffect(() => {
    if (error) {
      navigate('/error', {
        state: { type: 'polaroid_failed', message: error },
      });
    }
  }, [error, navigate]);

  const handleRetake = () => {
    navigate('/camera');
  };

  const handlePrint = () => {
    if (!polaroidBlob || !polaroidUrl) return;
    navigate('/uploading', {
      state: { polaroidBlob, polaroidUrl },
    });
  };

  if (isGenerating || !polaroidUrl) {
    return <LoadingOverlay message="Creating your Polaroid..." />;
  }

  return (
    <PageContainer>
      <PolaroidPreview imageUrl={polaroidUrl} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
        <PrimaryButton onClick={handlePrint}>{weddingConfig.printLabel}</PrimaryButton>
        <SecondaryButton onClick={handleRetake}>{weddingConfig.retakeLabel}</SecondaryButton>
      </Box>
    </PageContainer>
  );
}
