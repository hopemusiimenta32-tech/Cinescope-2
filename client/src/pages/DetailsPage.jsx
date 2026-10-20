import { useCallback, useState } from 'react';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { tmdbApi } from '../api/tmdbApi.js';
import ApiErrorState from '../components/ApiErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PosterFallback from '../components/PosterFallback.jsx';
import WatchlistButton from '../components/WatchlistButton.jsx';
import useApiResource from '../hooks/useApiResource.js';
import { getTmdbImageUrl } from '../utils/tmdbImages.js';

function formatReleaseDate(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const year = value.slice(0, 4);
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return /^\d{4}$/.test(value) ? value : '';
  if (value.length === 4) return value;
  const readableDate = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
  return year && readableDate.endsWith(year) ? readableDate : `${readableDate} (${year})`;
}

function isValidId(id) {
  return typeof id === 'string' && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
}

export default function DetailsPage() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [posterFailed, setPosterFailed] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);
  const validMediaType = mediaType === 'movie' || mediaType === 'tv';
  const validId = isValidId(id);
  const listingPath = mediaType === 'tv' ? '/tv-shows' : '/movies';
  const loadDetails = useCallback((signal) => {
    if (!validMediaType || !validId) return Promise.resolve(null);
    return tmdbApi.details(mediaType, id, { signal });
  }, [id, mediaType, validId, validMediaType]);
  const { data, error, loading, retry } = useApiResource(loadDetails);

  const goBack = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate(listingPath, { replace: true });
  };

  const title = data && (mediaType === 'movie' ? data.title : data.name);
  const releaseDate = formatReleaseDate(mediaType === 'movie' ? data?.release_date : data?.first_air_date);
  const rating = Number.isFinite(data?.vote_average) ? data.vote_average.toFixed(1) : '';
  const genres = Array.isArray(data?.genres) ? data.genres.filter((genre) => genre && typeof genre.name === 'string' && genre.name.trim()) : [];
  const posterUrl = getTmdbImageUrl(data?.poster_path, 'w500');
  const backdropUrl = getTmdbImageUrl(data?.backdrop_path, 'w1280');

  return <Stack spacing={{ xs: 2.5, md: 3 }}>
    <Button onClick={goBack} startIcon={<span aria-hidden="true">←</span>} sx={{ alignSelf: 'flex-start', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
      {location.key !== 'default' ? 'Back' : `Back to ${mediaType === 'tv' ? 'TV shows' : 'movies'}`}
    </Button>

    {!validMediaType ? <Alert severity="warning" action={<Button color="inherit" size="small" onClick={() => navigate('/movies', { replace: true })}>Browse movies</Button>}>
      Unsupported media type. Details links must use “movie” or “tv”.
    </Alert> : !validId ? <Alert severity="warning" action={<Button color="inherit" size="small" onClick={() => navigate(listingPath, { replace: true })}>Browse {mediaType === 'tv' ? 'TV shows' : 'movies'}</Button>}>
      This details link does not contain a valid catalog ID.
    </Alert> : loading ? <LoadingState label={`Loading ${mediaType === 'movie' ? 'movie' : 'TV show'} details`} />
      : error ? <ApiErrorState message={error} onRetry={retry} />
        : !data ? <EmptyState title="Details unavailable" description="The catalog did not return details for this title." />
          : <>
            <Box sx={{ position: 'relative', width: '100%', height: { xs: 175, sm: 250, md: 330 }, overflow: 'hidden', borderRadius: { xs: 2.5, md: 3.5 }, bgcolor: '#171c25', background: 'radial-gradient(ellipse at 80% 20%, rgba(240,182,91,0.16), transparent 45%), linear-gradient(120deg, #202632, #11151d)' }}>
              {backdropUrl && !backdropFailed && <Box component="img" src={backdropUrl} alt={`${title || 'Title'} backdrop`} onError={() => setBackdropFailed(true)} sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />}
              <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(13,16,22,0.86) 0%, rgba(13,16,22,0.24) 72%, rgba(13,16,22,0.08) 100%)' }} />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 3.5, md: 4 }} alignItems={{ sm: 'flex-start' }} sx={{ mt: { xs: -8, sm: -10, md: -12 }, px: { xs: 1.5, sm: 3, md: 4 }, position: 'relative' }}>
              <Box sx={{ width: { xs: 138, sm: 190, md: 230 }, flexShrink: 0, alignSelf: { xs: 'center', sm: 'flex-start' }, borderRadius: 2.5, overflow: 'hidden', boxShadow: '0 18px 48px rgba(0,0,0,0.45)' }}>
                {posterUrl && !posterFailed ? <Box component="img" src={posterUrl} alt={`${title || 'Title'} poster`} onError={() => setPosterFailed(true)} sx={{ display: 'block', width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', bgcolor: '#1a202b' }} />
                  : <PosterFallback title="Poster unavailable" sx={{ borderRadius: 0 }} />}
              </Box>

              <Stack spacing={2} sx={{ minWidth: 0, flex: 1, pt: { sm: 9, md: 11 }, textAlign: { xs: 'center', sm: 'left' } }}>
                <Box>
                  <Typography component="h1" variant="h3" sx={{ fontSize: { xs: '1.9rem', sm: '2.35rem', md: '3rem' }, lineHeight: 1.12, overflowWrap: 'anywhere' }}>
                    {title || 'Title unavailable'}
                  </Typography>
                  {data.tagline && <Typography color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>{data.tagline}</Typography>}
                  <Box sx={{ mt: 1.5 }}><WatchlistButton item={data} mediaType={mediaType} variant="button" /></Box>
                </Box>

                <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  <Chip label={mediaType === 'movie' ? 'Movie' : 'TV show'} size="small" color="primary" variant="outlined" />
                  {releaseDate && <Chip label={mediaType === 'movie' ? `Released ${releaseDate}` : `First aired ${releaseDate}`} size="small" variant="outlined" />}
                  {rating && <Chip label={`★ ${rating} / 10`} size="small" variant="outlined" sx={{ color: 'primary.main', borderColor: 'rgba(240,182,91,0.36)' }} />}
                  {Number.isFinite(data.runtime) && data.runtime > 0 && <Chip label={`${data.runtime} min`} size="small" variant="outlined" />}
                  {Number.isFinite(data.number_of_seasons) && <Chip label={`${data.number_of_seasons} ${data.number_of_seasons === 1 ? 'season' : 'seasons'}`} size="small" variant="outlined" />}
                </Stack>

                <Box>
                  <Typography variant="h6" sx={{ mb: 0.75, fontWeight: 700 }}>Overview</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
                    {typeof data.overview === 'string' && data.overview.trim() ? data.overview : 'No overview is available for this title.'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Genres</Typography>
                  {genres.length ? <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    {genres.map((genre) => <Chip key={genre.id || genre.name} label={genre.name} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.055)' }} />)}
                  </Stack> : <Typography variant="body2" color="text.secondary">Genre information unavailable.</Typography>}
                </Box>
              </Stack>
            </Stack>
          </>}
  </Stack>;
}
