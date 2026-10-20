import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

export const navigationItems = [
  { label: 'Home', path: '/', glyph: '⌂' },
  { label: 'Movies', path: '/movies', glyph: '▣' },
  { label: 'TV Shows', path: '/tv-shows', glyph: '▤' },
  { label: 'Search', path: '/search', glyph: '⌕' },
  { label: 'My Watchlist', path: '/watchlist', glyph: '♡' },
];

export default function NavigationLinks({ onNavigate, compact = false }) {
  const location = useLocation();
  return <List disablePadding sx={{ display: 'grid', gap: 0.65 }}>
    {navigationItems.map((item) => {
      const selected = item.path === '/' ? location.pathname === '/' : location.pathname === item.path;
      return <ListItemButton key={item.path} component={NavLink} to={item.path} onClick={onNavigate} selected={selected} aria-current={selected ? 'page' : undefined}
        sx={{ minHeight: 46, px: 1.5, borderRadius: 2, color: selected ? 'primary.main' : 'text.secondary', '&.Mui-selected': { bgcolor: 'rgba(240,182,91,0.11)', color: 'primary.main' }, '&.Mui-selected:hover': { bgcolor: 'rgba(240,182,91,0.16)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.055)', color: 'text.primary' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <Box component="span" aria-hidden="true" sx={{ width: 28, mr: compact ? 0 : 1.25, fontSize: 20, textAlign: 'center', lineHeight: 1 }}>{item.glyph}</Box>
        {!compact && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 700 : 550 }} />}
      </ListItemButton>;
    })}
  </List>;
}
