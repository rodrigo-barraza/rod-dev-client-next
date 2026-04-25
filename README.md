# Rod Dev Client — Portfolio & Gym Tracker

A Next.js portfolio site for [rod.dev](https://rod.dev) featuring an AI art gallery, project showcase, and gym tracking application. Built with the Pages Router, TypeScript, SCSS Modules, and the Temporal API.

## ✨ Features

### 🎨 Portfolio

- **Home Gallery** — masonry grid of artwork with hover descriptions and lightbox navigation
- **Collections** — curated project collections with detail views, media, and descriptions
- **Projects / About** — CV-style page with skills, education, social links, and categorized work history
- **AI Art Generator** — generate images via the Rod Dev Service API with customizable parameters
- **Renders Gallery** — filterable gallery of AI-generated art with like/favorite system

### 🏋️ Gym Tracker

- **Exercise Journal** — daily workout logging with sets, reps, and weight
- **Volume Tracking** — automatic total/average volume, rep, and weight calculations
- **Experience System** — visual XP bar progression per exercise
- **Exercise Library** — structured collection of exercises with equipment, stance, form, and style metadata

### 🔧 Infrastructure

- **SEO** — per-page meta tags, Open Graph, and structured data via `SeoHead` component
- **Analytics** — Google Tag Manager + custom event tracking with session management
- **Zustand Store** — global state management for API availability and application state
- **Temporal API** — all date operations use the TC39 Temporal standard (with polyfill for Safari)

## 📂 Directory Structure

```
rod-dev-client-next/
├── public/                              # Static assets
└── src/
    ├── pages/                           # Next.js Pages Router
    │   ├── _app.tsx                     # App wrapper with Layout, analytics, session tracking
    │   ├── _document.tsx                # Custom document with GTM, Google Fonts
    │   ├── index.tsx                    # Home — portfolio gallery
    │   ├── collections/[id].tsx         # Collection detail view
    │   ├── generate/index.tsx           # AI image generation interface
    │   ├── gym/index.tsx                # Gym tracker — exercise journal & logging
    │   ├── likes/index.tsx              # Liked renders gallery
    │   ├── projects/index.tsx           # CV / about page
    │   ├── renders/index.tsx            # AI renders gallery
    │   ├── rodrigo-barraza/index.tsx    # About page
    │   └── 404.tsx                      # Custom 404
    ├── components/                      # Reusable React components (~20)
    │   ├── HeaderComponent/             # Site header with nav, hamburger, logo
    │   ├── FooterComponent/             # Footer with links grid and brand
    │   ├── ButtonComponent/             # Multi-variant button (pill, transparent, etc.)
    │   ├── GalleryComponent/            # Grid/list gallery with card details
    │   ├── Txt2ImageComponent/          # Image generation form + preview
    │   ├── ExerciseComponent/           # Gym exercise card with sets/reps grid
    │   ├── PaginationComponent/         # Page navigation
    │   ├── FilterComponent/             # Filter bar
    │   ├── DialogComponent/             # Modal dialog
    │   ├── SeoHead/                     # SEO meta tag component
    │   ├── Layout.tsx                   # Page layout wrapper
    │   └── ActiveLink.tsx               # Active-state navigation link
    ├── libraries/                       # API clients and utilities
    │   ├── UtilityLibrary.ts            # Date (Temporal), formatting, navigation helpers
    │   ├── RenderApiLibrary.ts          # Rod Dev Service API client (renders CRUD)
    │   ├── GymApiLibrary.ts             # Gym journal API client
    │   ├── EventLibrary.ts              # Analytics event dispatcher
    │   ├── EventApiLibrary.ts           # Analytics API client
    │   ├── LikeApiLibrary.ts            # Like/unlike API client
    │   └── FavoriteApiLibrary.ts        # Favorite API client
    ├── collections/                     # Static data collections (exercises, samplers, styles)
    ├── contexts/                        # React context providers
    ├── hooks/                           # Custom React hooks
    ├── stores/                          # Zustand global state
    │   └── ZustandStore.tsx             # Application state store
    ├── styles/                          # Global SCSS
    │   ├── styles.scss                  # CSS variables, resets, typography, layout
    │   └── animations.scss              # Keyframe animations
    ├── types/                           # TypeScript type definitions
    └── wrappers/                        # API wrappers
        ├── FetchWrapper.ts              # HTTP client with error handling
        └── EventBusWrapper.ts           # Event bus (mitt) singleton
```

## ⚙️ Prerequisites

- **Node.js** v22+
- **Rod Dev Service** — running and accessible (backend API for renders, gym, events)

## 🛠️ Tech Stack

| Dependency             | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| Next.js 16             | React framework with Pages Router            |
| React 19               | UI library                                   |
| TypeScript 6           | Type safety                                  |
| SCSS Modules           | Component-scoped styling                     |
| Zustand                | Lightweight global state management          |
| Temporal API           | Modern date/time handling (with polyfill)     |
| @vercel/analytics      | Client-side analytics                        |
| lodash                 | Utility functions                            |

## 🚀 Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable                     | Required | Description                    |
| ---------------------------- | -------- | ------------------------------ |
| `NEXT_PUBLIC_RODRIGO_SERVICE`| Yes      | URL of the Rod Dev Service API |

> **Note:** `.env` is gitignored — never commit it.

### 3️⃣ Run the development server

```bash
npm run dev
```

Opens on [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

```bash
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build (Turbopack)
npm start             # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format all files with Prettier
npm run format:check  # Check formatting without writing
```

## ☀️ Part of [Sun](https://github.com/rodrigo-barraza)

Rod Dev Client is one frontend in the Sun ecosystem — a collection of composable backend services and frontends designed to be mixed and matched.
