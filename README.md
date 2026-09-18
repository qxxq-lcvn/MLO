# MLO — Rice Paddy Fauna & Ecosystem Designer

Interactive rice field map & plant layout designer with a fauna-driven ecosystem simulation, built with Next.js, React, TypeScript, and Three.js.

## Features

- **MLO palette** — Rice plant, Rice field, Pests, Predators, Parasitoids, Neutral animals, Water, Others. Each category expands to its specific items with hover tooltips explaining ecological role.
- **2D freeform map canvas** — drag items from the palette, click to place, drag to reposition, dedicated erase tool, pannable/scrollable field.
- **Plant Preview inspector** — click a placed rice plant to open a rotatable 3D side view (Three.js) plus tabs: Position, Damage, Pests, Predators, Parasitoids, Neutral animals, Note, Others. Attach placed fauna to a specific plant; they render at their correct elevation layer (air / canopy / ground / water / subsoil) in 3D.
- **Whole-field 3D side view** — toggle from the top bar for a rotatable overview of the entire map.
- **Ecosystem dashboard** — live Pest Index, Biocontrol Index, Net Balance, and Adjusted Yield, computed with the formulas from `rice_paddy_fauna_development_plan.md`, plus contextual alerts (e.g. rat/snake balance, biocontrol status).
- **16 fauna definitions** — Bee, Bird, Butterfly, Cricket, Dragonfly, Duck, Fish, Frog, Ladybug, Spider, Rat, Snake, Trichogramma, Wasp, WeaverAnt, Worm — each with category, preferred layer, elevation range, and ecological impact.
- **Save / Load** — export/import the map layout as JSON; state also persists to `localStorage`.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS
- Three.js via `@react-three/fiber` and `@react-three/drei`
- Zustand for state management

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```

## Project structure

```
src/
  app/                  Next.js App Router entry (layout, page, globals.css)
  components/
    layout/              Sidebar (MLO palette) and TopBar (editing tools)
    map/                 2D MapCanvas and whole-field Map3DPreview
    plant/               Plant Preview inspector + 3D plant side view
    dashboard/           Ecosystem balance dashboard
  data/                  Fauna definitions, map element definitions, palette categories
  lib/                   Ecosystem formulas, unified definition lookup
  store/                 Zustand designer store (placed items, tools, persistence)
  types/                 Shared TypeScript types
```

## Deployment

This is a standard Next.js app and deploys to [Vercel](https://vercel.com) with no extra configuration:

```bash
vercel login
vercel --prod
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
