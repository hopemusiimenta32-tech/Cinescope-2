import { Box } from '@mui/material';
import MediaCard from './MediaCard.jsx';

export default function MediaGrid({ items, mediaType, columns = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: `repeat(${columns.xs || 2}, minmax(0, 1fr))`, sm: `repeat(${columns.sm || columns.xs || 2}, minmax(0, 1fr))`, md: `repeat(${columns.md || columns.sm || 3}, minmax(0, 1fr))`, lg: `repeat(${columns.lg || columns.md || 4}, minmax(0, 1fr))`, xl: `repeat(${columns.xl || columns.lg || 5}, minmax(0, 1fr))` }, gap: { xs: 1.5, sm: 2.25, md: 2.75 } }}>
    {items.map((item) => <MediaCard key={`${item.media_type || mediaType}-${item.id}`} item={item} mediaType={mediaType} />)}
  </Box>;
}
