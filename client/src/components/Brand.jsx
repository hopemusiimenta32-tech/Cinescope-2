import { Box, Typography } from '@mui/material';

export default function Brand({ compact = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }} aria-label="CineScope home">
      <Box aria-hidden="true" sx={{ width: 34, height: 34, borderRadius: '11px', display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: 'rgba(240,182,91,0.13)', border: '1px solid rgba(240,182,91,0.18)', fontSize: 17, fontWeight: 800 }}>
        C
      </Box>
      {!compact && <Typography variant="h6" sx={{ fontWeight: 760, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>Cine<span style={{ color: '#f0b65b' }}>Scope</span></Typography>}
    </Box>
  );
}
