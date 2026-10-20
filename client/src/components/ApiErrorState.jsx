import { Alert, Button, Stack } from '@mui/material';

export default function ApiErrorState({ message = 'We could not load this content.', onRetry }) {
  return <Alert severity="error" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Try again</Button> : undefined}>
    <Stack spacing={0.25}><strong>Something went wrong</strong><span>{message}</span></Stack>
  </Alert>;
}
