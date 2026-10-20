import { Router } from 'express';

const router = Router();
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const REQUEST_TIMEOUT_MS = 10_000;

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function positiveInteger(value, label, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new ApiError(400, 'INVALID_PARAMETER', `${label} must be a positive integer.`);
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > max) {
    throw new ApiError(400, 'INVALID_PARAMETER', `${label} must be between 1 and ${max}.`);
  }
  return number;
}

function pageNumber(value) {
  return value === undefined ? 1 : positiveInteger(value, 'page', 500);
}

function mediaType(value, { includeAll = false } = {}) {
  const accepted = includeAll ? ['movie', 'tv', 'all'] : ['movie', 'tv'];
  if (!accepted.includes(value)) {
    throw new ApiError(400, 'INVALID_MEDIA_TYPE', `mediaType must be ${accepted.join(' or ')}.`);
  }
  return value;
}

function requireToken() {
  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  if (!token || token === 'replace_with_your_tmdb_read_access_token') {
    throw new ApiError(503, 'TMDB_NOT_CONFIGURED', 'The TMDB service is not configured. Add TMDB_READ_ACCESS_TOKEN to server/.env.');
  }
  return token;
}

function validateResults(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.results) || !Number.isInteger(payload.page)) {
    throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE', 'TMDB returned an unexpected response. Please try again later.');
  }
  if (!payload.results.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
    throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE', 'TMDB returned an unexpected response. Please try again later.');
  }
}

function validateDetails(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Number.isSafeInteger(payload.id)) {
    throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE', 'TMDB returned an unexpected response. Please try again later.');
  }
}

function validateGenres(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.genres) || !payload.genres.every((genre) => genre && Number.isSafeInteger(genre.id) && typeof genre.name === 'string')) {
    throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE', 'TMDB returned an unexpected response. Please try again later.');
  }
}

async function requestTmdb(path, query = {}) {
  const token = requireToken();
  const url = new URL(`${TMDB_API_BASE}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }

  let response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new ApiError(504, 'TMDB_TIMEOUT', 'The TMDB request timed out. Please try again.');
    }
    throw new ApiError(502, 'TMDB_UNAVAILABLE', 'The TMDB service could not be reached. Please try again later.');
  }

  if (!response.ok) {
    if (response.status === 404) throw new ApiError(404, 'NOT_FOUND', 'The requested TMDB resource was not found.');
    if (response.status === 429) throw new ApiError(503, 'TMDB_RATE_LIMITED', 'TMDB is temporarily rate limiting requests. Please try again shortly.');
    throw new ApiError(502, 'TMDB_REQUEST_FAILED', 'TMDB could not complete the request. Check the server configuration or try again later.');
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE', 'TMDB returned an unexpected response. Please try again later.');
  }
}

function sendAsync(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response)).catch(next);
}

router.get('/trending/:mediaType', sendAsync(async (request, response) => {
  const type = mediaType(request.params.mediaType, { includeAll: true });
  const window = request.query.window ?? 'week';
  if (!['day', 'week'].includes(window)) throw new ApiError(400, 'INVALID_PARAMETER', 'window must be day or week.');
  const page = pageNumber(request.query.page);
  const payload = await requestTmdb(`/trending/${type}/${window}`, { page });
  validateResults(payload);
  response.json(payload);
}));

router.get('/movies/popular', sendAsync(async (request, response) => {
  const payload = await requestTmdb('/movie/popular', { page: pageNumber(request.query.page) });
  validateResults(payload);
  response.json(payload);
}));

router.get('/tv-shows/popular', sendAsync(async (request, response) => {
  const payload = await requestTmdb('/tv/popular', { page: pageNumber(request.query.page) });
  validateResults(payload);
  response.json(payload);
}));

router.get('/search/:mediaType', sendAsync(async (request, response) => {
  const type = mediaType(request.params.mediaType);
  const query = typeof request.query.query === 'string' ? request.query.query.trim() : '';
  if (!query || query.length > 200) throw new ApiError(400, 'INVALID_QUERY', 'query is required and must be 1 to 200 characters.');
  const payload = await requestTmdb(`/search/${type}`, { query, page: pageNumber(request.query.page), include_adult: false });
  validateResults(payload);
  response.json(payload);
}));

router.get('/details/:mediaType/:id', sendAsync(async (request, response) => {
  const type = mediaType(request.params.mediaType);
  const id = positiveInteger(request.params.id, 'id');
  const payload = await requestTmdb(`/${type}/${id}`);
  validateDetails(payload);
  response.json(payload);
}));

router.get('/genres/:mediaType', sendAsync(async (request, response) => {
  const type = mediaType(request.params.mediaType);
  const payload = await requestTmdb(`/genre/${type}/list`);
  validateGenres(payload);
  response.json(payload);
}));

router.get('/discover/:mediaType', sendAsync(async (request, response) => {
  const type = mediaType(request.params.mediaType);
  const genreId = positiveInteger(request.query.genreId, 'genreId');
  const payload = await requestTmdb(`/discover/${type}`, { with_genres: genreId, page: pageNumber(request.query.page) });
  validateResults(payload);
  response.json(payload);
}));

export function tmdbErrorHandler(error, _request, response, _next) {
  if (error instanceof ApiError) {
    return response.status(error.status).json({ error: { code: error.code, message: error.message } });
  }
  return response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' } });
}

export default router;
