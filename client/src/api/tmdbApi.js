import axios from 'axios';

// This client points only to the CineScope Express API. TMDB credentials stay server-side.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 12_000,
  headers: { Accept: 'application/json' },
});

const get = async (path, params = {}, requestConfig = {}) => (await api.get(path, { params, ...requestConfig })).data;

export const tmdbApi = {
  trending: (mediaType = 'all', { window = 'week', page = 1, signal } = {}) => get(`/trending/${mediaType}`, { window, page }, { signal }),
  popularMovies: (page = 1, { signal } = {}) => get('/movies/popular', { page }, { signal }),
  popularTvShows: (page = 1, { signal } = {}) => get('/tv-shows/popular', { page }, { signal }),
  searchMovies: (query, page = 1, { signal } = {}) => get('/search/movie', { query, page }, { signal }),
  searchTvShows: (query, page = 1, { signal } = {}) => get('/search/tv', { query, page }, { signal }),
  details: (mediaType, id, { signal } = {}) => get(`/details/${mediaType}/${id}`, {}, { signal }),
  genres: (mediaType, { signal } = {}) => get(`/genres/${mediaType}`, {}, { signal }),
  discoverByGenre: (mediaType, genreId, page = 1, { signal } = {}) => get(`/discover/${mediaType}`, { genreId, page }, { signal }),
};

export default tmdbApi;
