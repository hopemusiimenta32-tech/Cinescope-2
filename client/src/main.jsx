import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppLayout from './layouts/AppLayout.jsx';
import theme from './theme/theme.js';
import LoadingState from './components/LoadingState.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MoviesPage = lazy(() => import('./pages/MoviesPage.jsx'));
const TvShowsPage = lazy(() => import('./pages/TvShowsPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage.jsx'));
const DetailsPage = lazy(() => import('./pages/DetailsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WatchlistProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingState label="Loading page" />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/tv-shows" element={<TvShowsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/details/:mediaType/:id" element={<DetailsPage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WatchlistProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
