import { Button, type ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../theme';

export function PrimaryButton({ children, sx, ...props }: ButtonProps) {
  return (
    <Button
      component={motion.button}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      variant="contained"
      fullWidth
      sx={{
        background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
        color: '#fff',
        boxShadow: '0 8px 24px rgba(201, 169, 98, 0.35)',
        fontSize: '1.05rem',
        py: 1.75,
        '&:hover': {
          background: `linear-gradient(135deg, ${colors.goldDark} 0%, ${colors.gold} 100%)`,
          boxShadow: '0 12px 32px rgba(201, 169, 98, 0.45)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
