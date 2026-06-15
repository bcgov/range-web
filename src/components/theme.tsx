import { createTheme } from '@material-ui/core';
import { createTheme as createV5Theme } from '@mui/material/styles';

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
      root: {
        textTransform: 'none',
      },
      containedPrimary: {
        fontWeight: 'bold',
      },
    },
  } as any,
});

const v5Theme = createV5Theme({
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        containedPrimary: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

export { v5Theme };
export default theme;
