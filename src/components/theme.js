import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Lato, sans-serif'
  },
  palette: {
    primary: {
      main: '#002C71'
    },
    secondary: {
      main: '#F3B229'
    }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    }
  }
})

export default theme
