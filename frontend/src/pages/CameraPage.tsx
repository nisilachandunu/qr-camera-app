import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CameraView } from '../components/CameraView';
import { useCamera } from '../hooks/useCamera';

export function CameraPage() {
  const navigate = useNavigate();
  const { videoRef, isReady, error, hasMultipleCameras, start, switchCamera, capture } =
    useCamera();
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    void start();
  }, [start]);

  useEffect(() => {
    if (error) {
      navigate('/error', { state: { type: error.type, message: error.message } });
    }
  }, [error, navigate]);

  const handleCapture = useCallback(async () => {
    setIsCapturing(true);
    try {
      const blob = await capture();
      if (blob) {
        navigate('/preview', { state: { capturedBlob: blob } });
      }
    } finally {
      setIsCapturing(false);
    }
  }, [capture, navigate]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: '#000',
        zIndex: 100,
      }}
    >
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 'max(12px, env(safe-area-inset-top))',
          left: 12,
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
        }}
        aria-label="Go back"
      >
        <ArrowBackIcon />
      </IconButton>

      <CameraView
        videoRef={videoRef}
        isReady={isReady}
        hasMultipleCameras={hasMultipleCameras}
        onCapture={() => void handleCapture()}
        onSwitchCamera={() => void switchCamera()}
        isCapturing={isCapturing}
      />
    </Box>
  );
}
