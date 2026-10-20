import { Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import MediaGrid from '../components/MediaGrid.jsx';
import PlaceholderPage from '../components/PlaceholderPage.jsx';

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const mediaItems = items.map((entry) => ({
    id: entry.id,
    media_type: entry.mediaType,
    title: entry.mediaType === 'movie' ? entry.title : undefined,
    name: entry.mediaType === 'tv' ? entry.title : undefined,
    poster_path: entry.posterPath,
    release_date: entry.mediaType === 'movie' ? entry.releaseDate : undefined,
    first_air_date: entry.mediaType === 'tv' ? entry.releaseDate : undefined,
    vote_average: entry.rating,
  }));

  return <PlaceholderPage eyebrow="SAVED FOR LATER" title="My Watchlist" description="Your saved movies and TV shows stay in this browser, ready whenever you are.">
    {mediaItems.length ? <MediaGrid items={mediaItems} mediaType="all" /> : <Stack spacing={2}>
      <EmptyState title="Your watchlist is empty" description="Save a movie or TV show with the bookmark control and it will appear here." />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button component={RouterLink} to="/movies" variant="contained">Discover movies</Button>
        <Button component={RouterLink} to="/tv-shows" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.16)', color: 'text.primary' }}>Discover TV shows</Button>
      </Stack>
    </Stack>}
  </PlaceholderPage>;
}
