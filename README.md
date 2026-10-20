# CineScope

CineScope is a university movie and TV discovery project. It uses a React, JavaScript JSX, and Vite frontend with Material UI and React Router, plus an Express API server. The server proxies movie and TV requests to TMDB and keeps the TMDB Read Access Token out of browser code. Real catalog responses require a valid token configured on the server.

## Requirements

- Node.js 20 LTS or later and npm
- A TMDB account and Read Access Token ([TMDB API documentation](https://developer.themoviedb.org/docs/getting-started))

## Setup (macOS and Windows)

Commands below work in a terminal opened at the CineScope project root (VS Code terminal is fine).

1. Install the root, frontend, and backend dependencies:

   ```sh
   npm run install:all
   ```

2. Get a TMDB Read Access Token from your TMDB account's API settings. The Express server loads its environment from `server/.env` when started through the documented npm scripts (`npm run dev` or `npm run dev:server`). The exact private variable name is `TMDB_READ_ACCESS_TOKEN`. Keep the real token only in `server/.env`; never put credentials in a `VITE_` variable. Private environment files are excluded from Git and should not be included in a ZIP.

   Copy the example to the server environment file (macOS/Linux):

   ```sh
   cp .env.example server/.env
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example server/.env
   ```

   `.env.example` contains placeholders only. Set `TMDB_READ_ACCESS_TOKEN`, `PORT`, and `CLIENT_ORIGIN` in `server/.env`. The copied example also contains the public `VITE_API_BASE_URL` line; it is not used by the server. If the local backend URL differs from `http://localhost:5000/api`, create `client/.env` with only `VITE_API_BASE_URL=http://your-backend-host:5000/api`. Never put the TMDB token in `client/.env` or any `VITE_` variable. After editing `server/.env`, stop the running development process with Ctrl+C and restart it from the project root with `npm run dev` (or use `npm run dev:server` for the backend alone). Restart Vite after changing client environment configuration.

3. Start client and server together:

   ```sh
   npm run dev
   ```

   Vite serves the frontend at `http://localhost:5173`; Express listens at `http://localhost:5000`. The server health check is `http://localhost:5000/api/health`. With no valid token, API data routes respond with a clear configuration error; CineScope does not substitute sample titles. The token is needed for real catalog results, while the shell and local watchlist can be used without it.

Run either side separately with `npm run dev:client` or `npm run dev:server`.

## Build

Create the production frontend bundle:

```sh
npm run build
```

Preview that bundle locally with `npm run preview --prefix client`.

## API routes

- `GET /api/trending/:mediaType?window=week&page=1` where `mediaType` is `all`, `movie`, or `tv`, and `window` is `day` or `week`.
- `GET /api/movies/popular?page=1` and `GET /api/tv-shows/popular?page=1`.
- `GET /api/search/movie?query=...&page=1` and `GET /api/search/tv?query=...&page=1`.
- `GET /api/details/:mediaType/:id` for `movie` or `tv`.
- `GET /api/genres/:mediaType` for `movie` or `tv`.
- `GET /api/discover/:mediaType?genreId=...&page=1` for `movie` or `tv`.

The browser Axios service calls the CineScope API only. The server uses TMDB's v3 endpoints and Bearer authorization header. Movie and TV data and images are supplied by [The Movie Database (TMDB)](https://www.themoviedb.org/). CineScope is an independent student project. **This product uses the TMDB API but is not endorsed or certified by TMDB.**

## Deployment

Deploy the Express API and Vite frontend as separate services:

1. Deploy the Node.js server and set `TMDB_READ_ACCESS_TOKEN` as a private server environment secret. Set `CLIENT_ORIGIN` to the deployed frontend's exact origin (scheme and host, without an API path). Use the `PORT` value provided by the hosting platform when one is required.
2. Build the frontend with `npm run build` and publish `client/dist`. Set `VITE_API_BASE_URL` to the deployed API base URL, for example `https://api.example.com/api`, in the frontend build environment. Vite embeds `VITE_` variables in browser assets, so this variable must contain only the public API URL.
3. Use HTTPS for both services, allow the frontend origin through the server's `CLIENT_ORIGIN`, and configure the frontend host to serve `index.html` for client-side routes such as `/details/movie/123`.
4. Verify the health endpoint, a movie/TV request, direct loading of a nested route, and the browser console after deployment. Do not upload or bundle `.env` files.

## Submission checklist

- [x] React/Vite app, Express proxy, API-driven discovery/search/details, genre filters, and local watchlist implemented.
- [x] README includes setup commands, environment guidance, TMDB attribution, and deployment considerations.
- [ ] Configure a valid server-side TMDB Read Access Token and verify live results.
- [ ] Create the GitHub repository and upload the reviewed project. This workspace is not currently a Git repository.
- [ ] Deploy the frontend and backend, then add the live application URL here: `____________________________`.
- [ ] Capture and include at least two screenshots: Home and a real movie or TV Details page (for example, in a `screenshots/` folder).
- [ ] Re-run `npm run build` after final configuration and prepare the ZIP without `node_modules`, `dist`, or private environment files.
