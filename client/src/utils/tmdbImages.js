const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function getTmdbImageUrl(path, size = 'w342') {
  if (typeof path !== 'string' || !path.startsWith('/')) return '';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
