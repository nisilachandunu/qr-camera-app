import { Box, Typography } from '@mui/material';
import { colors } from '../theme';

export function Footer() {
  return (
    <Box sx={{ textAlign: 'center', mt: 4, py: 2 }}>
      <Typography variant="caption" sx={{ color: colors.textSecondary, opacity: 0.7 }}>
        With love, always
      </Typography>
    </Box>
  );
}
