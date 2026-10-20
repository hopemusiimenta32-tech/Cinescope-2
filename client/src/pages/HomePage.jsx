import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MediaSection from '../components/MediaSection.jsx';
import { tmdbApi } from '../api/tmdbApi.js';

const loadTrending = (signal) => tmdbApi.trending('all', { window: 'week', page: 1, signal });
const loadPopularMovies = (signal) => tmdbApi.popularMovies(1, { signal });
const loadPopularTvShows = (signal) => tmdbApi.popularTvShows(1, { signal });

export default function HomePage() {
  return <Stack spacing={{ xs: 4, md: 5 }}>
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: { xs: 270, sm: 330 }, p: { xs: 3, sm: 5, md: 6 }, display: 'flex', alignItems: 'center', borderRadius: 4, border: '1px solid rgba(240,182,91,0.15)', background: 'radial-gradient(ellipse at 82% 50%, rgba(240,182,91,0.16), transparent 34%), linear-gradient(115deg, #1b2029 0%, #141821 58%, #191b20 100%)' }}>
      <Box aria-hidden="true" sx={{ position: 'absolute', right: { xs: -35, sm: 8, md: 56 }, top: '50%', transform: 'translateY(-50%) rotate(-8deg)', width: { xs: 145, sm: 200, md: 240 }, height: { xs: 190, sm: 260, md: 310 }, borderRadius: 3, border: '1px solid rgba(240,182,91,0.22)', bgcolor: 'rgba(255,255,255,0.025)', boxShadow: '0 30px 100px rgba(0,0,0,0.32)', display: 'grid', placeItems: 'center', color: 'rgba(240,182,91,0.5)', fontSize: { xs: 56, sm: 76 }, opacity: { xs: 0.55, sm: 0.8 } }}>✦</Box>
      <Stack spacing={2} sx={{ position: 'relative', maxWidth: 560, zIndex: 1 }}>
        <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.16em', fontWeight: 750 }}>A NEW WAY TO DISCOVER</Typography>
        <Typography component="h1" variant="h2" sx={{ fontSize: { xs: '2.1rem', sm: '3rem', md: '3.5rem' }, lineHeight: 1.05 }}>Stories worth<br />your screen time.</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 440, lineHeight: 1.75 }}>Explore trending movies and television drawn directly from the live catalog.</Typography>
        <Stack direction="row" spacing={1.25} sx={{ pt: 0.5 }}>
          <Button variant="contained" component={RouterLink} to="/movies" endIcon={<span aria-hidden="true">→</span>}>Explore movies</Button>
          <Button variant="outlined" component={RouterLink} to="/tv-shows" sx={{ borderColor: 'rgba(255,255,255,0.16)', color: 'text.primary' }}>TV shows</Button>
        </Stack>
      </Stack>
    </Box>
    <MediaSection title="Trending this week" description="Movies and series people are discovering now." mediaType="all" load={loadTrending} />
    <MediaSection title="Popular movies" description="Popular films from the TMDB catalog." to="/movies" mediaType="movie" load={loadPopularMovies} />
    <MediaSection title="Popular TV shows" description="Popular series from the TMDB catalog." to="/tv-shows" mediaType="tv" load={loadPopularTvShows} />
  </Stack>;
}
