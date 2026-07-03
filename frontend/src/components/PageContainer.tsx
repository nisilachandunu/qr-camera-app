import { Box, type BoxProps } from '@mui/material';
import { motion } from 'framer-motion';

interface PageContainerProps extends BoxProps {
  fullHeight?: boolean;
}

export function PageContainer({ children, fullHeight = false, sx, ...props }: PageContainerProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        minHeight: fullHeight ? '100dvh' : 'auto',
        px: 3,
        py: 3,
        paddingTop: 'max(24px, env(safe-area-inset-top))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(24px, env(safe-area-inset-left))',
        paddingRight: 'max(24px, env(safe-area-inset-right))',
        position: 'relative',
        zIndex: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
