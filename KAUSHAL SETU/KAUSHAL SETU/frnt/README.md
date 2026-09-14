# Kaushal Setu — Frontend

React + Vite + Tailwind CSS 4 frontend for Kaushal Setu, a digital bridge
between a person's skills and their future career.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend expects the Flask backend running on `http://localhost:5000`.
Override the API base URL in `.env.local`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Scripts

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the Vite dev server on port 3000    |
| `npm run build` | Typecheck and build for production        |
| `npm run lint`  | TypeScript check only (no emit)           |
| `npm run preview` | Serve the production build locally      |

## Structure

```
src/
  api/          Typed Axios client for every backend module
  components/   Brand, Navbar, Footer, page states, hero canvas
  config/       App identity and environment-driven API URL
  context/      JWT auth context (register, login, session restore)
  pages/        Landing, auth, dashboard, and feature pages
```
