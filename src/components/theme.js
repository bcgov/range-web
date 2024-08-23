import { createTheme } from '@material-ui/core';

const theme = createTheme({
  typography: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#002C71',
    },
    secondary: {
      main: '#F3B229',
    },
  },
  overrides: {
    MuiButton: {
      disableElevation: true,
      root: {
        textTransform: 'none',
      },
      containedPrimary: {
        fontWeight: 'bold',
      },
    },
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

export default theme;
