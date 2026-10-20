import { useState } from 'react';
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PosterFallback from './PosterFallback.jsx';
import WatchlistButton from './WatchlistButton.jsx';
import { getTmdbImageUrl } from '../utils/tmdbImages.js';

function getMediaTitle(item, mediaType) {
  return mediaType === 'movie' ? item.title : item.name;
}

function getMediaYear(item, mediaType) {
  const date = mediaType === 'movie' ? item.release_date : item.first_air_date;
  return typeof date === 'string' && date.length >= 4 ? date.slice(0, 4) : 'Year unavailable';
}

export default function MediaCard({ item, mediaType }) {
  const [imageFailed, setImageFailed] = useState(false);
  const itemMediaType = mediaType === 'all' ? item.media_type : mediaType;
  const resolvedMediaType = itemMediaType === 'tv' ? 'tv' : 'movie';
  const title = getMediaTitle(item, resolvedMediaType) || 'Title unavailable';
  const posterUrl = getTmdbImageUrl(item.poster_path);
  const showPoster = posterUrl && !imageFailed;
  const rating = Number.isFinite(item.vote_average) ? item.vote_average.toFixed(1) : null;

  return <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent', overflow: 'visible', position: 'relative' }}>
    <CardActionArea component={RouterLink} to={`/details/${resolvedMediaType}/${item.id}`} aria-label={`Open ${title} details`} sx={{ height: '100%', borderRadius: 2.5, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 }, '&:hover .media-poster': { transform: 'translateY(-4px)', borderColor: 'rgba(240,182,91,0.38)' } }}>
      <Box className="media-poster" sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '2 / 3', borderRadius: 2.5, bgcolor: '#1a202b', border: '1px solid rgba(255,255,255,0.07)', transition: 'transform 180ms ease, border-color 180ms ease' }}>
        {showPoster ? <Box component="img" src={posterUrl} alt={`${title} poster`} loading="lazy" onError={() => setImageFailed(true)} sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <PosterFallback title="Poster unavailable" sx={{ height: '100%', aspectRatio: 'auto', border: 0, borderRadius: 0 }} />}
        {rating !== null && <Box sx={{ position: 'absolute', top: 9, left: 9, px: 1, py: 0.4, borderRadius: 1.5, bgcolor: 'rgba(13,16,22,0.86)', backdropFilter: 'blur(8px)', color: 'primary.main', fontSize: 12, fontWeight: 750 }} aria-label={`Rating ${rating} out of 10`}>★ {rating}</Box>}
      </Box>
      <CardContent sx={{ px: 0.25, pt: 1.15, pb: '4px !important' }}>
        <Typography variant="subtitle2" noWrap title={title} sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mt: 0.35 }}>
          <Typography variant="caption" color="text.secondary">{getMediaYear(item, resolvedMediaType)}</Typography>
          <Typography variant="caption" color="text.secondary">{resolvedMediaType === 'movie' ? 'Movie' : 'TV'}</Typography>
        </Stack>
      </CardContent>
    </CardActionArea>
    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
      <WatchlistButton item={item} mediaType={resolvedMediaType} />
    </Box>
  </Card>;
}
