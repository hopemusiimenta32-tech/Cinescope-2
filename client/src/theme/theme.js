import { createTheme, alpha } from '@mui/material/styles';

const gold = '#f0b65b';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: gold, contrastText: '#16120b' },
    background: { default: '#0d1016', paper: '#151a23' },
    text: { primary: '#f4f2ed', secondary: '#a0a6b2' },
    divider: 'rgba(255,255,255,0.08)',
    error: { main: '#f47777' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 750, letterSpacing: '-0.045em' },
    h2: { fontWeight: 700, letterSpacing: '-0.035em' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em' },
    button: { textTransform: 'none', fontWeight: 650, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: 320, backgroundImage: 'radial-gradient(ellipse at 55% -20%, rgba(240,182,91,0.08), transparent 40%)' },
        '::selection': { background: alpha(gold, 0.35) },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, transition: 'background-color 160ms ease, transform 160ms ease', '&:focus-visible': { outline: `2px solid ${gold}`, outlineOffset: 3 } },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { '&:focus-visible': { outline: `2px solid ${gold}`, outlineOffset: 2 } } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export default theme;
