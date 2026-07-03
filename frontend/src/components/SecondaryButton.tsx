import { Button, type ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '../theme';

export function SecondaryButton({ children, sx, ...props }: ButtonProps) {
  return (
    <Button
      component={motion.button}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      variant="outlined"
      fullWidth
      sx={{
        borderColor: colors.gold,
        color: colors.textPrimary,
        borderWidth: 2,
        fontSize: '1.05rem',
        py: 1.75,
        '&:hover': {
          borderWidth: 2,
          borderColor: colors.goldDark,
          backgroundColor: 'rgba(201, 169, 98, 0.08)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
