import { Paper, type PaperProps } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../theme';

interface AnimatedCardProps extends PaperProps {
  delay?: number;
}

export function AnimatedCard({ children, delay = 0, sx, ...props }: AnimatedCardProps) {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${colors.lightBeige}`,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(61, 54, 48, 0.08)',
        p: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
