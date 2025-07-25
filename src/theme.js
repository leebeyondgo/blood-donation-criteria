import { createTheme } from '@mui/material/styles';

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
      paper: '#fffbfe',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d0bcff',
    },
    secondary: {
      main: '#ccc2dc',
    },
    background: {
      default: '#1c1b1f',
      paper: '#1c1b1f',
    },
  },
});
