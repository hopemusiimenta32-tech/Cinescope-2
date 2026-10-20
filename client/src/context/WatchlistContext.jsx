import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addWatchlistEntry, getWatchlistKey, loadWatchlist, persistWatchlist, removeWatchlistEntry } from '../utils/watchlist.js';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(loadWatchlist);

  useEffect(() => {
    persistWatchlist(items);
  }, [items]);

  const addItem = useCallback((item, mediaType) => {
    setItems((current) => addWatchlistEntry(current, item, mediaType));
  }, []);

  const removeItem = useCallback((mediaType, id) => {
    setItems((current) => removeWatchlistEntry(current, mediaType, id));
  }, []);

  const toggleItem = useCallback((item, mediaType) => {
    const key = getWatchlistKey(mediaType, item?.id);
    if (!key) return;
    setItems((current) => current.some((entry) => getWatchlistKey(entry.mediaType, entry.id) === key)
      ? removeWatchlistEntry(current, mediaType, item.id)
      : addWatchlistEntry(current, item, mediaType));
  }, []);

  const savedKeys = useMemo(() => new Set(items.map((item) => getWatchlistKey(item.mediaType, item.id))), [items]);
  const isSaved = useCallback((mediaType, id) => savedKeys.has(getWatchlistKey(mediaType, id)), [savedKeys]);
  const value = useMemo(() => ({ items, addItem, removeItem, toggleItem, isSaved }), [items, addItem, removeItem, toggleItem, isSaved]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used inside WatchlistProvider.');
  return context;
}
