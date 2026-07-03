import { Box, Typography } from '@mui/material';
import { colors } from '../theme';

export function Header() {
  return (
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          color: colors.gold,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
        }}
      >
        Polaroid Guestbook
      </Typography>
    </Box>
  );
}
