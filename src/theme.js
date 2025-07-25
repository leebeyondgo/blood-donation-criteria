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
  },
  typography,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography,
});
