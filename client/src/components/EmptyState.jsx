import { Box, Typography } from '@mui/material';

export default function EmptyState({ title = 'Nothing here yet', description = 'When content is available, it will appear here.' }) {
  return <Box sx={{ minHeight: 210, p: { xs: 3, sm: 4 }, display: 'grid', placeContent: 'center', justifyItems: 'center', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.13)', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.015)' }}>
    <Box aria-hidden="true" sx={{ mb: 1.5, width: 46, height: 46, display: 'grid', placeItems: 'center', borderRadius: 2, color: 'primary.main', bgcolor: 'rgba(240,182,91,0.1)', fontSize: 21 }}>✦</Box>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 390 }}>{description}</Typography>
  </Box>;
}
