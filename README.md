# rod.dev — Portfolio & Gym Tracker

Portfolio site for [rod.dev](https://rod.dev) — featuring an AI art gallery, project showcase, gym tracking, and an AI image generation interface.

**Live:** [rod.dev](https://rod.dev)

## Features

### Portfolio

- **Home Gallery** — Masonry grid of artwork with hover descriptions and lightbox navigation
- **Collections** — Curated project collections with detail views, media, and descriptions
- **Projects / About** — CV-style page with skills, education, social links, and categorized work history
- **AI Art Generator** — Generate images via the Rod Dev Service API with customizable parameters
- **Renders Gallery** — Filterable gallery of AI-generated art with like/favorite system

### Gym Tracker

- **Exercise Journal** — Daily workout logging with sets, reps, and weight
- **Volume Tracking** — Automatic total/average volume, rep, and weight calculations
- **Experience System** — Visual XP bar progression per exercise
- **Exercise Library** — Structured collection of exercises with equipment, stance, form, and style metadata

### Infrastructure

- **SEO** — Per-page meta tags, Open Graph, and structured data via `SeoHead` component
- **Analytics** — Google Tag Manager + custom event tracking with session management
- **Zustand Store** — Global state management for API availability and application state
- **Temporal API** — All date operations use the TC39 Temporal standard (with polyfill)

## Stack

| Dependency | Purpose |
|---|---|
| Next.js 16 | React framework (Pages Router) |
| React 19 | UI library |
| TypeScript 6 | Type safety |
| SCSS Modules | Component-scoped styling |
| Zustand | Lightweight global state management |
| Temporal API | Modern date/time handling (with `@js-temporal/polyfill`) |
| @vercel/analytics | Client-side analytics |
| Lodash | Utility functions |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env

# 3. Start dev server (Turbopack)
npm run dev
```

## Environment

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_RODRIGO_SERVICE` | Yes | URL of the Rod Dev Service API |

> **Note:** `.env` is gitignored — never commit it.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build (Turbopack) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run deploy` | Build & deploy to Synology NAS |
| `npm run deploy:dry` | Dry-run deploy (validate only) |

## Architecture

```
rod-dev-client/
├── public/                     # Static assets
├── src/
│   ├── pages/                  # Next.js Pages Router
│   │   ├── collections/        # Collection detail views
│   │   ├── generate/           # AI image generation interface
│   │   ├── gym/                # Gym tracker — exercise journal & logging
│   │   ├── likes/              # Liked renders gallery
│   │   ├── projects/           # CV / about page
│   │   ├── renders/            # AI renders gallery
│   │   └── rodrigo-barraza/    # About page
│   ├── components/             # React components (~20)
│   │   ├── BadgeComponent/
│   │   ├── ButtonComponent/
│   │   ├── DialogComponent/
│   │   ├── ExerciseComponent/
│   │   ├── FilterComponent/
│   │   ├── FooterComponent/
│   │   ├── GalleryComponent/
│   │   ├── GenerateHeaderComponent/
│   │   ├── HeaderComponent/
│   │   ├── InputComponent/
│   │   ├── LikeComponent/
│   │   ├── PaginationComponent/
│   │   ├── SelectComponent/
│   │   ├── SeoHead/
│   │   ├── SliderComponent/
│   │   ├── TextAreaComponent/
│   │   └── Txt2ImageComponent/
│   ├── collections/            # Static data (exercises, samplers, styles, etc.)
│   ├── constants/              # API constants
│   ├── contexts/               # React context providers
│   ├── hooks/                  # Custom hooks (useFilteredPagination, useGuest)
│   ├── libraries/              # API clients (Render, Gym, Event, Like, Favorite)
│   ├── stores/                 # Zustand global state
│   ├── styles/                 # Global SCSS (variables, resets, animations)
│   ├── types/                  # TypeScript type definitions
│   └── wrappers/               # HTTP client and event bus wrappers
├── next.config.ts              # Next.js config
└── deploy.sh                   # Synology NAS deploy script
```

## Related Services

- **Rod Dev Service** — Backend API for renders, gym data, events, likes, and favorites
