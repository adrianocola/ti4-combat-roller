# TI4 Combat Roller

Web app to set up and roll [Twilight Imperium 4](https://boardgamegeek.com/boardgame/233078/twilight-imperium-fourth-edition) combat dice.

Built with [Vite](https://vitejs.dev/), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), and [Framer Motion](https://www.framer.com/motion/).

## Features

- Dice grouped by unit combat value (10 down to 2).
- Tap the right half of a row to add a die; tap the left half to remove one.
- Roll button rolls all dice in the current set; reset clears them.
- Total hits + cumulative hit chance shown in the bottom bar; tap to open the full hit-chance table.
- 5 color sets — switch via swipe, header arrows, ← / → keys, or shift + mouse wheel.
- Each color set keeps its own dice (useful for rolling attack and defense in parallel).
- Responsive layout for mobile and desktop, plus iOS safe-area insets.

## Develop

Requirements:

- [Node.js](https://nodejs.org/) (see `.nvmrc`)
- [pnpm](https://pnpm.io/)

```shell
git clone https://github.com/adrianocola/ti4-combat-roller
cd ti4-combat-roller
pnpm install

# Optional analytics + random-number API endpoint
cp .env.sample .env.local

pnpm dev      # start Vite dev server (http://localhost:5173)
pnpm build    # production build into dist/
pnpm preview  # preview the production build
pnpm typecheck
```

The repo is a pnpm workspace; the optional `workers/` package contains a Cloudflare Worker that serves random integers consumed by the app when `VITE_PUBLIC_API_ENDPOINT` is set.
