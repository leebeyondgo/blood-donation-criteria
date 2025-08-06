import { createTheme } from '@mui/material/styles';

const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  h1: {
    fontSize: '2.125rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 500,
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750a4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#625b71',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fffbfe',
      paper: '#f3f3f3',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  typography,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d0bcff',
    },
    secondary: {
      main: '#ccc2dc',
      dark: '#383838',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#121212',
    },
  },
  typography,
});
