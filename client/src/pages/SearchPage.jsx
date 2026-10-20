import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, FormControl, FormControlLabel, IconButton, InputAdornment, Pagination, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { tmdbApi } from '../api/tmdbApi.js';
import ApiErrorState from '../components/ApiErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MediaGrid from '../components/MediaGrid.jsx';
import PlaceholderPage from '../components/PlaceholderPage.jsx';
import useApiResource from '../hooks/useApiResource.js';

const validMediaTypes = ['all', 'movie', 'tv'];

function getPage(searchParams) {
  const parsed = Number(searchParams.get('page'));
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 500 ? parsed : 1;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('query') || '').trim();
  const selectedType = searchParams.get('type');
  const mediaType = validMediaTypes.includes(selectedType) ? selectedType : 'all';
  const page = getPage(searchParams);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => setInputValue(query), [query]);

  const loadSearch = useCallback(async (signal) => {
    if (!query) return null;
    if (mediaType === 'movie') return tmdbApi.searchMovies(query, page, { signal });
    if (mediaType === 'tv') return tmdbApi.searchTvShows(query, page, { signal });

    const [movies, shows] = await Promise.all([
      tmdbApi.searchMovies(query, page, { signal }),
      tmdbApi.searchTvShows(query, page, { signal }),
    ]);
    return {
      page,
      total_pages: Math.max(movies.total_pages || 1, shows.total_pages || 1),
      results: [
        ...(Array.isArray(movies.results) ? movies.results.map((item) => ({ ...item, media_type: 'movie' })) : []),
        ...(Array.isArray(shows.results) ? shows.results.map((item) => ({ ...item, media_type: 'tv' })) : []),
      ],
    };
  }, [mediaType, page, query]);

  const { data, error, loading, retry } = useApiResource(loadSearch);
  const results = Array.isArray(data?.results) ? data.results : [];
  const pageCount = Math.max(1, Math.min(Number.isInteger(data?.total_pages) ? data.total_pages : 1, 500));

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') next.delete(key);
      else next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const nextQuery = inputValue.trim();
    updateParams({ query: nextQuery || null, page: null });
  };

  const clearSearch = () => {
    setInputValue('');
    updateParams({ query: null, page: null });
  };

  const changeMediaType = (event) => updateParams({ type: event.target.value === 'all' ? null : event.target.value, page: null });

  return <PlaceholderPage eyebrow="FIND SOMETHING TO WATCH" title="Search" description="Search the live movie and television catalog by title.">
    <Stack spacing={3}>
      <Stack component="form" role="search" onSubmit={submitSearch} direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField fullWidth value={inputValue} onChange={(event) => setInputValue(event.target.value)} placeholder="Enter a movie or TV title" inputProps={{ 'aria-label': 'Search title' }}
          InputProps={{ endAdornment: inputValue && <InputAdornment position="end"><IconButton aria-label="Clear search" onClick={clearSearch} edge="end"><Box component="span" aria-hidden="true">×</Box></IconButton></InputAdornment> }} />
        <Button type="submit" variant="contained" sx={{ minWidth: { sm: 120 } }}>Search</Button>
      </Stack>

      <FormControl>
        <Typography component="span" id="search-type-label" variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>Search in</Typography>
        <RadioGroup row aria-labelledby="search-type-label" name="search-media-type" value={mediaType} onChange={changeMediaType}>
          <FormControlLabel value="all" control={<Radio size="small" />} label="Movies & TV" />
          <FormControlLabel value="movie" control={<Radio size="small" />} label="Movies" />
          <FormControlLabel value="tv" control={<Radio size="small" />} label="TV shows" />
        </RadioGroup>
      </FormControl>

      {!query ? <EmptyState title="Search the live catalog" description="Enter a title above and submit to search real movies and TV shows. Whitespace-only searches are ignored." />
        : loading ? <LoadingState label={`Searching ${mediaType === 'all' ? 'movies and TV shows' : mediaType === 'movie' ? 'movies' : 'TV shows'}`} />
          : error ? <ApiErrorState message={error} onRetry={retry} />
            : results.length ? <>
              <Alert severity="info" role="status">Results for “{query}”{mediaType === 'all' ? ' across movies and TV shows' : mediaType === 'movie' ? ' in movies' : ' in TV shows'}.</Alert>
              <MediaGrid items={results} mediaType={mediaType} />
              {pageCount > 1 && <Stack alignItems="center" spacing={1} sx={{ pt: 1 }}>
                <Pagination count={pageCount} page={page} onChange={(_event, nextPage) => updateParams({ page: nextPage })} color="primary" shape="rounded" aria-label="Search result pages" />
                <Typography variant="caption" color="text.secondary">Page {page} of {pageCount}</Typography>
              </Stack>}
            </>
              : <EmptyState title="No results found" description={`The live catalog returned no ${mediaType === 'all' ? 'movies or TV shows' : mediaType === 'movie' ? 'movies' : 'TV shows'} for “${query}”. Try another title.`} />}
    </Stack>
  </PlaceholderPage>;
}
