# Dave Yoon — Portfolio

My personal portfolio site: [dave-yoon-portfolio.vercel.app](https://dave-yoon-portfolio.vercel.app)

A single-page React site with an animated space-themed background — twinkling
stars, two slowly spinning planets, the occasional shooting star, and a small
ship that follows the cursor — built with React, TypeScript, Vite, and
Tailwind CSS, and deployed on Vercel.

## Features

- **Ambient canvas background** — a starfield with a connected-node effect
  around the cursor, drifting asteroids, shooting stars, and two planets that
  spin on a slightly tilted axis with a synced rotating ring accent, all
  hand-rolled on `<canvas>` (`src/components/AmbientBackground.tsx`)
- **Working contact form** — submissions POST to a Vercel serverless
  function (`api/contact.ts`) that sends real email via
  [Resend](https://resend.com), with copy-to-clipboard fallbacks on the
  footer email/phone links
- **Locked dark theme, scroll-aware nav, and reduced-motion support**
  throughout

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) for dev/build tooling
- [Tailwind CSS v4](https://tailwindcss.com)
- [Resend](https://resend.com) for transactional email
- [Vercel](https://vercel.com) for hosting and serverless functions
- [oxlint](https://oxc.rs) for linting

## Getting started

```bash
npm install
npm run dev
```

The contact form's `/api/contact` route only runs under Vercel's dev server
(plain `vite dev` serves the frontend only), so to exercise it locally:

```bash
npm i -g vercel
vercel dev
```

You'll need a `RESEND_API_KEY` environment variable — pull it from the linked
Vercel project with `vercel env pull`, or set your own in `.env.local`.

## Scripts

| Command           | Description                          |
| ------------------ | ------------------------------------- |
| `npm run dev`       | Start the Vite dev server             |
| `npm run build`     | Type-check and build for production   |
| `npm run preview`   | Preview the production build locally  |
| `npm run lint`      | Run oxlint                            |

## Project structure

```
src/
  components/   UI sections (Hero, About, Education, Projects, Contact, Nav, ...)
  data/         Static content for Education and Projects sections
  hooks/        Small shared hooks (scroll-reveal animation)
api/
  contact.ts    Serverless function that sends contact-form emails via Resend
```
