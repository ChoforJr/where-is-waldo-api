# Where's Waldo API

TypeScript Express API and Socket.IO server for the Where's Waldo photo tagging game.

## Stack and security

- Express 5, TypeScript strict mode, PostgreSQL, Prisma.
- Socket.IO gameplay rooms publish live state changes and completed leaderboard entries.
- Zod validates input; Helmet adds security headers; CORS is restricted to configured origins; login and registration are rate limited.
- Authentication uses bcryptjs password hashes and opaque random HttpOnly session cookies. Only SHA-256 hashes of session tokens are stored in the database.

## Setup

Requirements: Node.js 20.19+ and PostgreSQL.

Install dependencies and configure `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/where_is_waldo_api
ALLOWED_ORIGINS=http://localhost:3000
PORT=5000
```

Apply migrations and generate Prisma Client:

```sh
npm install
npx prisma migrate deploy
npx prisma generate
```

Run locally with `npm run dev`, or build and start with `npm run build && npm start`. The API and WebSocket endpoint share port 5000. `GET /health` is available for health checks.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and session |
| POST | `/api/auth/login` | Authenticate and create a session |
| GET | `/api/auth/me` | Get current session user (protected) |
| GET | `/api/auth/stats` | Get account-linked round summary (protected) |
| POST | `/api/auth/logout` | Revoke current session (protected) |
| GET | `/api/gameplay/finished` | Public completed-game leaderboard source |
| POST | `/api/gameplay/level/:level` | Start a game on board 1–4 |
| GET | `/api/gameplay/:gameID` | Load a game |
| PATCH | `/api/gameplay/:gameID/character` | Submit a character location guess |
| PATCH | `/api/gameplay/:gameID/player` | Save a completed game's player name; links it when signed in |

Socket clients connect to the API origin, then emit `game:join` with a gameplay ID and `game:leave` when done. Rooms receive `game:state`, `game:character:found`, and `game:completed`; connected clients receive `leaderboard:updated`.

## Commands

- `npm run dev` — watch/restart the TypeScript server.
- `npm run build` — generate Prisma Client and compile.
- `npm run typecheck` — check source types without emitting.
- `npm test` — run unit tests.
- `npx prisma migrate dev --name descriptive_change` — create a development migration.

For deployment set exact comma-separated frontend origins in `ALLOWED_ORIGINS`, apply migrations with `prisma migrate deploy`, and use HTTPS so production session cookies are secure. Production auth cookies use `SameSite=None; Secure` for cross-origin frontend/API deployments, while state-changing auth requests validate the configured origin.
