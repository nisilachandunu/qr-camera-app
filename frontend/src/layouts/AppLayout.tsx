import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Outlet />
    </Box>
  );
}
