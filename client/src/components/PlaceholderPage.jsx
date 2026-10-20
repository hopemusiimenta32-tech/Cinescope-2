import { Box, Chip, Stack, Typography } from '@mui/material';

export default function PlaceholderPage({ eyebrow = 'CINESCOPE', title, description, children }) {
  return <Stack spacing={{ xs: 3, md: 4 }}>
    <Box>
      <Chip label={eyebrow} size="small" sx={{ mb: 1.8, color: 'primary.main', bgcolor: 'rgba(240,182,91,0.1)', fontWeight: 750, letterSpacing: '0.08em' }} />
      <Typography component="h1" variant="h3" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 650, lineHeight: 1.75 }}>{description}</Typography>
    </Box>
    {children}
  </Stack>;
}
