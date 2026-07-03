import { Box, IconButton } from '@mui/material';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import { motion } from 'framer-motion';
import type { RefObject } from 'react';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  hasMultipleCameras: boolean;
  onCapture: () => void;
  onSwitchCamera: () => void;
  isCapturing?: boolean;
}

export function CameraView({
  videoRef,
  isReady,
  hasMultipleCameras,
  onCapture,
  onSwitchCamera,
  isCapturing = false,
}: CameraViewProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: '#000',
        overflow: 'hidden',
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
        }}
      />

      {!isReady && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
          }}
        >
          Starting camera...
        </Box>
      )}

      {hasMultipleCameras && (
        <IconButton
          onClick={onSwitchCamera}
          sx={{
            position: 'absolute',
            top: 'max(16px, env(safe-area-inset-top))',
            right: 16,
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
          aria-label="Switch camera"
        >
          <FlipCameraIosIcon />
        </IconButton>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 'max(32px, env(safe-area-inset-bottom))',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component={motion.button}
          whileTap={{ scale: 0.9 }}
          onClick={onCapture}
          disabled={!isReady || isCapturing}
          aria-label="Capture photo"
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '4px solid #fff',
            bgcolor: 'transparent',
            cursor: isReady ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isReady ? 1 : 0.5,
            '&::after': {
              content: '""',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#fff',
            },
          }}
        />
      </Box>
    </Box>
  );
}
