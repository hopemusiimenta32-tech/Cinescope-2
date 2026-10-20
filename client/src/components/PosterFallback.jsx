import { Box, Typography } from '@mui/material';

export default function PosterFallback({ title = 'Poster unavailable', sx = {} }) {
  return <Box role="img" aria-label={title} sx={{ width: '100%', aspectRatio: '2 / 3', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 1, p: 2, color: 'text.secondary', bgcolor: '#1a202b', backgroundImage: 'linear-gradient(145deg, rgba(240,182,91,0.08), transparent 55%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 2, ...sx }}>
    <Box aria-hidden="true" sx={{ fontSize: 28, color: 'primary.main', opacity: 0.8 }}>▧</Box>
    <Typography variant="caption" align="center">{title}</Typography>
  </Box>;
}
