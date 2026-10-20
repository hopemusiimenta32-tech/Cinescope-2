import { useCallback } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { tmdbApi } from '../api/tmdbApi.js';
import ApiErrorState from './ApiErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingState from './LoadingState.jsx';
import MediaGrid from './MediaGrid.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';
import useApiResource from '../hooks/useApiResource.js';

function getPage(params) {
  const page = Number(params.get('page'));
  return Number.isInteger(page) && page > 0 && page <= 500 ? page : 1;
}

function getGenreId(params) {
  const value = params.get('genre');
  return value && /^\d+$/.test(value) && Number(value) > 0 && Number.isSafeInteger(Number(value)) ? value : '';
}

export default function GenreMediaPage({ mediaType }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = getGenreId(searchParams);
  const page = getPage(searchParams);
  const isMovie = mediaType === 'movie';
  const label = isMovie ? 'movies' : 'TV shows';
  const genreLoader = useCallback((signal) => tmdbApi.genres(mediaType, { signal }), [mediaType]);
  const contentLoader = useCallback((signal) => {
    if (genreId) return tmdbApi.discoverByGenre(mediaType, genreId, page, { signal });
    return isMovie ? tmdbApi.popularMovies(page, { signal }) : tmdbApi.popularTvShows(page, { signal });
  }, [genreId, isMovie, mediaType, page]);

  const { data: genreData, error: genreError, loading: genresLoading, retry: retryGenres } = useApiResource(genreLoader);
  const { data, error, loading, retry } = useApiResource(contentLoader);
  const genres = Array.isArray(genreData?.genres) ? genreData.genres : [];
  const items = Array.isArray(data?.results) ? data.results : [];
  const pageCount = Math.max(1, Math.min(Number.isInteger(data?.total_pages) ? data.total_pages : 1, 500));

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') next.delete(key);
      else next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const selectGenre = (event) => updateParams({ genre: event.target.value || null, page: null });
  const changePage = (_event, nextPage) => updateParams({ page: nextPage === 1 ? null : nextPage });
  const selectedGenreExists = genres.some((genre) => String(genre.id) === genreId);

  return <PlaceholderPage
    eyebrow={isMovie ? 'THE MOVIE LIBRARY' : 'THE SERIES LIBRARY'}
    title={isMovie ? 'Movies' : 'TV Shows'}
    description={isMovie ? 'Browse popular films or filter the live catalog by genre.' : 'Discover popular series or filter the live catalog by genre.'}
  >
    <Stack spacing={3}>
      <FormControl size="small" sx={{ width: '100%', maxWidth: 360 }} disabled={genresLoading}>
        <InputLabel id={`${mediaType}-genre-label`}>Filter by genre</InputLabel>
        <Select labelId={`${mediaType}-genre-label`} id={`${mediaType}-genre`} value={genreId} label="Filter by genre" onChange={selectGenre}>
          <MenuItem value="">All {label}</MenuItem>
          {genreId && !selectedGenreExists && <MenuItem value={genreId} disabled>Genre {genreId}</MenuItem>}
          {genres.map((genre) => <MenuItem key={genre.id} value={String(genre.id)}>{genre.name}</MenuItem>)}
        </Select>
        {!genreError && <FormHelperText>{genresLoading ? 'Loading available genres…' : 'Choose a genre to filter catalog results.'}</FormHelperText>}
      </FormControl>

      {genreError && <ApiErrorState message={`Could not load ${isMovie ? 'movie' : 'TV'} genres. ${genreError}`} onRetry={retryGenres} />}

      {loading ? <LoadingState label={`Loading ${genreId ? 'filtered ' : 'popular '}${label}`} />
        : error ? <ApiErrorState message={error} onRetry={retry} />
          : items.length ? <MediaGrid items={items} mediaType={mediaType} />
            : <EmptyState title={`No ${label} found`} description={genreId ? 'The catalog returned no results for this genre and page. Try another genre or page.' : `The catalog returned no ${label} on this page. Try another page or come back later.`} />}

      {!error && pageCount > 1 && <Stack alignItems="center" spacing={1}>
        <Pagination count={pageCount} page={page} onChange={changePage} color="primary" shape="rounded" aria-label={`${isMovie ? 'Movie' : 'TV show'} results pages`} />
        <Typography variant="caption" color="text.secondary">Page {page} of {pageCount}</Typography>
      </Stack>}
    </Stack>
  </PlaceholderPage>;
}
