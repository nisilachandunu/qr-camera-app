import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../theme';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  message = 'Loading...',
  fullScreen = true,
}: LoadingOverlayProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        ...(fullScreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
            }
          : {}),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        background: fullScreen ? 'rgba(253, 251, 247, 0.92)' : 'transparent',
        backdropFilter: fullScreen ? 'blur(8px)' : 'none',
      }}
    >
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress size={56} thickness={3} sx={{ color: colors.gold }} />
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: colors.textPrimary,
          textAlign: 'center',
          fontFamily: '"Playfair Display", serif',
          fontSize: '1.1rem',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
