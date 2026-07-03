import { Box } from '@mui/material';
import { colors } from '../theme';

export function FloralBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: `linear-gradient(165deg, ${colors.warmWhite} 0%, ${colors.cream} 40%, ${colors.lightBeige} 100%)`,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.peach}40 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.gold}25 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      <Box
        component="svg"
        viewBox="0 0 200 200"
        sx={{
          position: 'absolute',
          top: '8%',
          left: '5%',
          width: 120,
          height: 120,
          opacity: 0.12,
        }}
      >
        <path
          d="M100 20 C120 50 150 60 130 90 C150 120 120 140 100 170 C80 140 50 120 70 90 C50 60 80 50 100 20Z"
          fill={colors.gold}
        />
      </Box>
      <Box
        component="svg"
        viewBox="0 0 200 200"
        sx={{
          position: 'absolute',
          bottom: '12%',
          right: '8%',
          width: 100,
          height: 100,
          opacity: 0.1,
        }}
      >
        <path
          d="M100 20 C120 50 150 60 130 90 C150 120 120 140 100 170 C80 140 50 120 70 90 C50 60 80 50 100 20Z"
          fill={colors.peach}
        />
      </Box>
    </Box>
  );
}
