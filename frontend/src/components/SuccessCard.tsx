import { Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import { colors } from '../theme';

interface SuccessCardProps {
  title: string;
  message: string;
}

export function SuccessCard({ title, message }: SuccessCardProps) {
  return (
    <AnimatedCard sx={{ textAlign: 'center', py: 4 }}>
      <Box
        component={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        sx={{ mb: 3 }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: colors.gold }} />
      </Box>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontFamily: '"Playfair Display", serif', color: colors.textPrimary }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        {message}
      </Typography>
    </AnimatedCard>
  );
}
