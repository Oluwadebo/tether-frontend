# Tether frontend

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. Data fetching with TanStack Query, dialogs with Radix UI, icons from Lucide.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend address.
3. `npm run dev` opens http://localhost:3000
The page should show the three typefaces and the color palette. If it does, setup is correct.

## Structure
```
app/
  layout.tsx       fonts and providers
  providers.tsx    TanStack Query provider
  globals.css      Tailwind import, design tokens (@theme), reduced-motion rule
  page.tsx         redirects to /login
  login/page.tsx   sign in and create account
  floor/page.tsx   placeholder, replaced by the dashboard in a later step
components/
  ThreadPanel.tsx  animated thread illustration on the login screen
  LoginForm.tsx    tabs, fields, password eye toggle, errors
  WakeGate.tsx     waiting screen while the free server wakes up
  ThreadLoader.tsx branded loader used instead of "Loading..." text
lib/
  api.ts           the only file that talks to the backend
```
`lib/socket.ts` is added in a later step.

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
