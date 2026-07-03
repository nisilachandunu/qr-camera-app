import { createTheme } from '@mui/material/styles';

export const colors = {
  warmWhite: '#FDFBF7',
  cream: '#F5F0E8',
  gold: '#C9A962',
  goldDark: '#A88B4A',
  peach: '#E8C4B8',
  lightBeige: '#EDE6DC',
  textPrimary: '#3D3630',
  textSecondary: '#6B635B',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.gold,
      dark: colors.goldDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.peach,
      contrastText: colors.textPrimary,
    },
    background: {
      default: colors.warmWhite,
      paper: colors.cream,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
    },
    h4: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 52,
          borderRadius: 28,
          padding: '14px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.warmWhite,
          minHeight: '100dvh',
        },
      },
    },
  },
});
