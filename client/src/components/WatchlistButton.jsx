import { Button, IconButton, Tooltip } from '@mui/material';
import { useWatchlist } from '../context/WatchlistContext.jsx';

export default function WatchlistButton({ item, mediaType, variant = 'icon' }) {
  const { isSaved, toggleItem } = useWatchlist();
  const resolvedMediaType = mediaType === 'all' ? item?.media_type : mediaType;
  const saved = isSaved(resolvedMediaType, item?.id);
  const label = saved ? 'Remove from Watchlist' : 'Add to Watchlist';
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(item, resolvedMediaType);
  };

  if (variant === 'button') {
    return <Button onClick={handleClick} aria-pressed={saved} startIcon={<span aria-hidden="true">{saved ? '♥' : '♡'}</span>} variant={saved ? 'outlined' : 'contained'}>
      {label}
    </Button>;
  }

  return <Tooltip title={label}>
    <IconButton onClick={handleClick} aria-label={label} aria-pressed={saved} size="small" sx={{ width: 36, height: 36, color: saved ? 'primary.main' : 'text.primary', bgcolor: 'rgba(13,16,22,0.88)', border: '1px solid rgba(255,255,255,0.13)', '&:hover': { bgcolor: 'rgba(13,16,22,0.98)', color: 'primary.main' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
      <span aria-hidden="true" style={{ fontSize: 19, lineHeight: 1 }}>{saved ? '♥' : '+'}</span>
    </IconButton>
  </Tooltip>;
}
