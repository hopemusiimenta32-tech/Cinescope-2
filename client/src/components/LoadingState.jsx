import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingState({ label = 'Loading' }) {
  return <Box role="status" aria-live="polite" sx={{ minHeight: 220, display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 2, color: 'text.secondary' }}>
    <CircularProgress size={30} aria-label={label} />
    <Typography variant="body2">{label}…</Typography>
  </Box>;
}
