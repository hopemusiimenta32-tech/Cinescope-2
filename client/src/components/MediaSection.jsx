import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ApiErrorState from './ApiErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingState from './LoadingState.jsx';
import MediaGrid from './MediaGrid.jsx';
import useApiResource from '../hooks/useApiResource.js';

export default function MediaSection({ title, description, to, viewAllLabel, mediaType, load, limit = 6 }) {
  const { data, error, loading, retry } = useApiResource(load);
  const items = Array.isArray(data?.results) ? data.results.slice(0, limit) : [];

  return <Box component="section" aria-label={title}>
    <Stack direction="row" justifyContent="space-between" alignItems="end" spacing={2} sx={{ mb: 2 }}>
      <Box>
        <Typography component="h2" variant="h5" sx={{ fontWeight: 750 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>{description}</Typography>
      </Box>
      {to && <Button component={RouterLink} to={to} size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}>{viewAllLabel || 'View all'} <span aria-hidden="true" style={{ marginLeft: 6 }}>→</span></Button>}
    </Stack>
    {loading ? <LoadingState label={`Loading ${title.toLowerCase()}`} />
      : error ? <ApiErrorState message={error} onRetry={retry} />
        : items.length ? <MediaGrid items={items} mediaType={mediaType} columns={{ xs: 2, sm: 3, md: 3, lg: 4, xl: 5 }} />
          : <EmptyState title={`No ${title.toLowerCase()} available`} description="The catalog returned no titles for this section. Try again later." />}
  </Box>;
}
