import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFoundPage() {
  return <Stack spacing={3}>
    <Typography component="h1" variant="h3">Page not found</Typography>
    <EmptyState title="This scene is missing" description="That address does not match a CineScope page. Head back to the discovery space and continue from there." />
    <Button component={RouterLink} to="/" variant="contained" sx={{ alignSelf: 'flex-start' }}>Back to home</Button>
  </Stack>;
}
