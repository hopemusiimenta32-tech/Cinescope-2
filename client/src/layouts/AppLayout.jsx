import { useEffect, useState } from 'react';
import { AppBar, Box, BottomNavigation, BottomNavigationAction, Drawer, IconButton, InputAdornment, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import NavigationLinks, { navigationItems } from '../components/NavigationLinks.jsx';

const drawerWidth = 238;
const mobileItems = navigationItems.filter((item) => item.path !== '/search');

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setSearchText(searchParams.get('query') || '');
  }, [location.search, searchParams]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    const currentType = searchParams.get('type');
    if (location.pathname === '/search' && ['all', 'movie', 'tv'].includes(currentType)) params.set('type', currentType);
    navigate({ pathname: '/search', search: params.toString() ? `?${params.toString()}` : '' });
  };

  const clearSearch = () => {
    setSearchText('');
    if (location.pathname === '/search') navigate('/search');
  };
  const selectedMobileTab = mobileItems.some((item) => item.path === location.pathname) ? location.pathname : false;
  const sidebar = <Box sx={{ px: 2, py: 2.5 }}>
    <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, fontWeight: 750, letterSpacing: '0.13em' }}>DISCOVER</Typography>
    <Box sx={{ mt: 1 }}><NavigationLinks onNavigate={() => setMobileMenuOpen(false)} /></Box>
    <Box sx={{ mx: 1.5, mt: 4, p: 1.8, borderRadius: 2.5, border: '1px solid rgba(255,255,255,0.07)', bgcolor: 'rgba(255,255,255,0.025)' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>A wider view of film</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.7, lineHeight: 1.6 }}>CineScope brings movies and television together in one place.</Typography>
    </Box>
  </Box>;

  return <Box sx={{ minHeight: '100vh' }}>
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'rgba(13,16,22,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, px: { xs: 1.5, sm: 3 } }}>
        <IconButton aria-label="Open navigation menu" onClick={() => setMobileMenuOpen(true)} sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1, color: 'text.primary' }}><Box component="span" aria-hidden="true" sx={{ fontSize: 22 }}>☰</Box></IconButton>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex', alignItems: 'center', mr: { xs: 'auto', md: 4 }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 } }}><Brand /></Box>
        <Box component="form" onSubmit={submitSearch} role="search" sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: 260, md: 330 }, mr: { sm: 2, md: 3 } }}>
          <TextField fullWidth size="small" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search movies & shows" inputProps={{ 'aria-label': 'Search movies and TV shows' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Box component="span" aria-hidden="true" sx={{ color: 'text.secondary', fontSize: 20 }}>⌕</Box></InputAdornment>, endAdornment: searchText && <InputAdornment position="end"><IconButton aria-label="Clear search" size="small" onClick={clearSearch} edge="end"><Box component="span" aria-hidden="true">×</Box></IconButton></InputAdornment> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.045)', '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' }, '&:hover fieldset': { borderColor: 'rgba(240,182,91,0.45)' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }} />
        </Box>
        <IconButton component={RouterLink} to="/search" aria-label="Go to search" sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'primary.main' }}><Box component="span" aria-hidden="true" sx={{ fontSize: 22 }}>⌕</Box></IconButton>
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap' }}>Find your next favorite</Typography>
      </Toolbar>
    </AppBar>

    <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', top: { md: 72 }, height: { md: 'calc(100% - 72px)' }, borderRight: '1px solid rgba(255,255,255,0.07)', bgcolor: 'rgba(13,16,22,0.72)' } }}>
      {sidebar}
    </Drawer>
    <Drawer anchor="left" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280, bgcolor: 'background.default', borderRight: '1px solid rgba(255,255,255,0.08)' } }}>
      <Toolbar sx={{ minHeight: '72px !important' }}><Brand /></Toolbar>{sidebar}
    </Drawer>

    <Box component="main" id="main-content" sx={{ ml: { xs: 0, md: `${drawerWidth}px` }, pt: { xs: '88px', sm: '100px' }, pb: { xs: '94px', md: 5 }, px: { xs: 2, sm: 3.5, lg: 5 }, minHeight: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}><Outlet /></Box>
    </Box>

    <Paper component="nav" aria-label="Primary mobile navigation" square elevation={0} sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar, borderTop: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(17,21,29,0.96)', backdropFilter: 'blur(16px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <BottomNavigation showLabels value={selectedMobileTab} sx={{ height: 66, bgcolor: 'transparent', '& .MuiBottomNavigationAction-root': { minWidth: 0, color: 'text.secondary', px: 0.5 }, '& .Mui-selected': { color: 'primary.main' }, '& .MuiBottomNavigationAction-label': { fontSize: 10, mt: 0.25 }, '& .Mui-selected .MuiBottomNavigationAction-label': { fontSize: 10 } }}>
        {mobileItems.map((item) => <BottomNavigationAction key={item.path} component={RouterLink} to={item.path} value={item.path} label={item.label === 'My Watchlist' ? 'Watchlist' : item.label} icon={<Box component="span" aria-hidden="true" sx={{ fontSize: 19, lineHeight: 1 }}>{item.glyph}</Box>} />)}
      </BottomNavigation>
    </Paper>
  </Box>;
}
