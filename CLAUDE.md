# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run dev:daemon   # Start dev server in background (logs → logs.txt)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run Vitest tests
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Reset database
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

UIGen is a Next.js 15 app (App Router) that lets users generate React components via Claude, with a live preview and Monaco code editor.

### Request flow

1. User types in `ChatInterface` → `ChatProvider` context sends `POST /api/chat`
2. API route streams responses from Claude (claude-haiku-4-5) using Vercel AI SDK
3. Claude calls two tools during generation:
   - `str_replace_editor` — view/create/replace/insert text in virtual files
   - `file_manager` — rename/delete files and directories
4. Tool calls update the in-memory `FileSystemProvider` context
5. After streaming completes, project state (messages + files) is saved to SQLite via Prisma
6. `PreviewFrame` picks up file changes, compiles JSX with Babel standalone in an iframe

### Key modules

- **`src/app/api/chat/route.ts`** — AI endpoint; defines the two tools, streams Claude responses, saves to DB
- **`src/lib/file-system.ts`** — Virtual file system (in-memory Map); serializes to/from JSON for DB storage
- **`src/lib/provider.ts`** — Selects real Anthropic provider or mock fallback (used when `ANTHROPIC_API_KEY` is absent)
- **`src/lib/auth.ts`** — JWT sessions (7-day, HTTP-only cookie); bcrypt password hashing
- **`src/lib/prompts/`** — System prompt that instructs Claude to generate Tailwind-styled React components
- **`src/components/preview/PreviewFrame.tsx`** — Iframe-isolated JSX renderer using `@babel/standalone`
- **`src/actions/index.ts`** — Server actions for auth (login/register/logout) and project CRUD
- **`src/middleware.ts`** — Protects routes; redirects unauthenticated users

### Database (Prisma + SQLite)

Schema has two models: `User` (email + hashed password) and `Project` (belongs to User, stores `messages` and `files` as JSON columns). `prisma/dev.db` is the local SQLite file.

### Auth model

- Anonymous users can create and use projects without signing up (no persistence across sessions)
- Authenticated users get projects saved to the DB
- JWT secret defaults to `"development-secret-key"` if `JWT_SECRET` env var is unset

### Environment

Copy `.env` and set `ANTHROPIC_API_KEY` for real AI responses. Without it, `provider.ts` returns a mock provider that generates a static placeholder component.

### Node.js compatibility

`node-compat.cjs` is required via `NODE_OPTIONS` in all npm scripts — it removes `globalThis.localStorage/sessionStorage` in server context to fix a Node 25+ incompatibility.
