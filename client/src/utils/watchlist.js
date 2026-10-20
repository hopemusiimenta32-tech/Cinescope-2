export const WATCHLIST_STORAGE_KEY = 'cinescope.watchlist.v1';

function normalizeId(id) {
  const numericId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
  return Number.isSafeInteger(numericId) && numericId > 0 ? numericId : null;
}

export function getWatchlistKey(mediaType, id) {
  const numericId = normalizeId(id);
  if (!numericId || !['movie', 'tv'].includes(mediaType)) return '';
  return `${mediaType}:${numericId}`;
}

export function normalizeWatchlistEntry(item, mediaType = item?.mediaType || item?.media_type) {
  if (!item || typeof item !== 'object' || Array.isArray(item) || !['movie', 'tv'].includes(mediaType)) return null;
  const id = normalizeId(item.id);
  if (!id) return null;

  const candidateTitle = mediaType === 'movie' ? item.title : (item.name || item.title);
  const title = typeof candidateTitle === 'string' && candidateTitle.trim()
    ? candidateTitle.trim()
    : `Untitled ${mediaType === 'movie' ? 'movie' : 'TV show'}`;
  const rawPoster = item.posterPath ?? item.poster_path;
  const posterPath = typeof rawPoster === 'string' && rawPoster.startsWith('/') ? rawPoster : null;
  const rawDate = item.releaseDate ?? item.release_date ?? item.first_air_date;
  const releaseDate = typeof rawDate === 'string' && rawDate.trim() ? rawDate.trim() : null;
  const rawRating = item.rating ?? item.vote_average;
  const rating = Number.isFinite(rawRating) && rawRating >= 0 && rawRating <= 10 ? rawRating : null;

  return { id, mediaType, title, posterPath, releaseDate, rating };
}

export function addWatchlistEntry(entries, item, mediaType) {
  const normalized = normalizeWatchlistEntry(item, mediaType);
  if (!normalized) return entries;
  const key = getWatchlistKey(normalized.mediaType, normalized.id);
  return entries.some((entry) => getWatchlistKey(entry.mediaType, entry.id) === key)
    ? entries
    : [normalized, ...entries];
}

export function removeWatchlistEntry(entries, mediaType, id) {
  const key = getWatchlistKey(mediaType, id);
  if (!key) return entries;
  return entries.filter((entry) => getWatchlistKey(entry.mediaType, entry.id) !== key);
}

export function loadWatchlist(storage) {
  try {
    const localStorage = storage || globalThis.localStorage;
    const serialized = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!serialized) return [];
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return [];

    const entries = [];
    const seen = new Set();
    for (const candidate of parsed) {
      const entry = normalizeWatchlistEntry(candidate);
      if (!entry) continue;
      const key = getWatchlistKey(entry.mediaType, entry.id);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push(entry);
    }
    return entries;
  } catch {
    return [];
  }
}

export function persistWatchlist(entries, storage) {
  try {
    const localStorage = storage || globalThis.localStorage;
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}
