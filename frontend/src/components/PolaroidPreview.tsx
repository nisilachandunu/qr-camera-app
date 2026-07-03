import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface PolaroidPreviewProps {
  imageUrl: string;
}

export function PolaroidPreview({ imageUrl }: PolaroidPreviewProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        my: 2,
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Your Polaroid photo"
        sx={{
          width: '100%',
          maxWidth: 320,
          height: 'auto',
          borderRadius: 1,
          boxShadow: '0 16px 48px rgba(61, 54, 48, 0.2)',
        }}
      />
    </Box>
  );
}
