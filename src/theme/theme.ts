import { createTheme, responsiveFontSizes } from '@mui/material';

import { breakpoints } from './breakpoints';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const theme = createTheme({
    breakpoints,
    palette: {
      mode,
    },
    typography: {
      fontFamily: "'Roboto Mono', monospace",
      h2: {
        fontSize: '3rem',
        '@media (min-width:600px)': {
          fontSize: '3.75rem',
        },
        '@media (min-width:900px)': {
          fontSize: '4.5rem',
        },
      },
      h6: {
        fontSize: '1.1rem',
        '@media (min-width:600px)': {
          fontSize: '1.25rem',
        },
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            '@media (min-width:600px)': {
              paddingLeft: '2rem',
              paddingRight: '2rem',
            },
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            gap: '1rem',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
