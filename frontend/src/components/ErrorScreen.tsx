import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { colors } from '../theme';
import type { ErrorType } from '../types';

interface ErrorScreenProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

const errorTitles: Record<ErrorType, string> = {
  camera_denied: 'Camera Access Needed',
  no_camera: 'No Camera Found',
  upload_failed: 'Upload Failed',
  network: 'Connection Problem',
  polaroid_failed: 'Something Went Wrong',
  unknown: 'Unexpected Error',
};

const errorHints: Record<ErrorType, string> = {
  camera_denied:
    'Please open your browser settings and allow camera access for this site, then try again.',
  no_camera: 'This device does not have a camera available. Please try on a phone with a camera.',
  upload_failed: 'We could not send your photo to the printer. Please try again.',
  network: 'Please check your internet connection and try again.',
  polaroid_failed: 'We could not create your Polaroid. Please retake your photo.',
  unknown: 'An unexpected error occurred. Please try again.',
};

export function ErrorScreen({ type, message, onRetry, onHome }: ErrorScreenProps) {
  return (
    <AnimatedCard sx={{ textAlign: 'center', py: 4 }}>
      <Box
        component={motion.div}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        sx={{ mb: 2 }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: colors.peach }} />
      </Box>
      <Typography
        variant="h5"
        sx={{ mb: 1.5, fontFamily: '"Playfair Display", serif' }}
      >
        {errorTitles[type]}
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3, lineHeight: 1.7 }}>
        {message || errorHints[type]}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {onRetry && <PrimaryButton onClick={onRetry}>Try Again</PrimaryButton>}
        {onHome && <SecondaryButton onClick={onHome}>Back to Home</SecondaryButton>}
      </Box>
    </AnimatedCard>
  );
}
