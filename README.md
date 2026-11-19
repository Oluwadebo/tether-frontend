# Tether frontend

Next.js (App Router), TypeScript and Tailwind CSS. Data fetching with TanStack Query, dialogs with Radix UI, icons from Lucide.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend address.
3. `npm run dev` opens http://localhost:3000
The page should show the three typefaces and the color palette. If it does, setup is correct.

## Structure
```
app/
  layout.tsx     fonts and providers
  providers.tsx  TanStack Query provider
  globals.css    base styles, reduced-motion rule
  page.tsx       setup check (replaced soon)
lib/
  api.ts         the only file that talks to the backend
tailwind.config.js  design tokens (colors, fonts, animations)
```
`components/` and `lib/socket.ts` are added in later steps.

## Rules for this project
- All backend calls live in `lib/api.ts`. No component calls `fetch` itself.
- Never use `window.confirm`, `alert` or `prompt`. Use a Radix dialog styled to match.
- Password inputs always have a show/hide eye toggle.
- No plain "Loading..." text. Use the thread-drawing loaders.
- Colors and fonts come from the Tailwind tokens, never hard-coded.
- Commit messages follow Conventional Commits, for example `feat(inbox): add thread view`.

## Design in one line
Each conversation is a thread. Ultramarine means the AI holds it, persimmon means your team does, and straw means the AI is unsure.

## Auth functions (in `lib/api.ts`)
`login`, `register`, `getMe` and `logout`. Login and register store the token for you; every later request sends it automatically. Errors arrive as `ApiError` with a message that is safe to show the user.
