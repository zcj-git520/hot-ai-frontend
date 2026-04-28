# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI 热点追踪平台 (AI Hot Topic Tracking Platform) - A full-stack Nuxt 3 application serving as an AI career navigator. Built with Vue 3, TypeScript, TailwindCSS, and Pinia.

**Note**: This project uses Nuxt 3 (not Next.js as originally planned in PRD). The `app/` directory is the primary structure using Nuxt 3 app router.

## Common Commands

```bash
# Install dependencies
pnpm install

# Development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Auto-fix linting
pnpm lint:fix
```

## Architecture

### Directory Structure

```
├── app/                    # Nuxt 3 app directory (primary)
│   ├── (auth)/            # Auth route group: login, register
│   ├── (public)/          # Public pages: articles, professions, tools, learning-paths
│   ├── (user)/            # User pages: profile
│   ├── components/        # Shared components
│   ├── layouts/           # Page layouts (default.vue)
│   └── lib/api.ts         # API client with interceptors
├── pages/                 # Legacy Nuxt file-based routing (parallel structure)
├── composables/           # Vue composables (useAuth, useToast)
├── middleware/            # Nuxt middleware (auth.ts)
├── server/api/            # Server API routes
├── assets/css/            # Global CSS
└── types/                 # TypeScript types
```

### API Client

API communication is handled via `app/lib/api.ts` with:
- Axios with interceptors
- Standard response format: `{code, data, message}`
- JWT token attached automatically via Authorization header
- 401 handling: clears auth and redirects to `/login`

Key API modules: `articleApi`, `professionApi`, `learningPathApi`, `toolApi`, `authApi`, `userApi`

### Authentication

`composables/useAuth.ts` provides:
- `token` / `refreshToken` state (persisted to localStorage)
- `setToken()`, `setUser()`, `clearAuth()`, `restoreAuth()`
- `refreshAccessToken()` - uses refresh token to get new access token
- `logout()` - calls API then clears local state
- `isAuthenticated()` - returns boolean

`middleware/auth.ts` handles route protection:
- Protected routes use `middleware: 'auth'` in page meta
- Redirects to `/login` if unauthenticated
- Redirects authenticated users away from login/register

### State Management

Pinia stores (`@pinia/nuxt`) - check `stores/` directory for any defined stores.

### SSE Real-time Updates

Per PRD, SSE should push new articles in real-time. The `GET /api/stream` endpoint provides this. The implementation status should be verified.

## Development Notes

- **Proxy Configuration**: In dev mode, Vite proxies `/api`, `/auth`, `/user`, `/learning-paths`, `/chapters` to the backend via `NUXT_PUBLIC_API_URL`
- **Backend API Base**: Default `http://localhost/api`, configurable via env var
- **API URL in browser console**: API client logs requests with token prefix for debugging
- **Response format**: API returns normalized data via interceptors - actual response is in `data` field

## Environment Variables

```
NUXT_PUBLIC_API_URL=http://localhost/api    # Backend API address
NUXT_SITE_NAME=AI 热点追踪平台
JWT_SECRET=...                              # Backend only
```
