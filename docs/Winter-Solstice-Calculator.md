# Winter Solstice Calculator

Short notes on what the app does and how to use it.

## What it does
- Compares today's daylight with December 21 for a handful of Norwegian cities.
- Shows sunrise and sunset from the local NOAA-based helper (no external API calls).
- Supports both keyboard selection (keys 1–8) and touch buttons.
- Includes a simple countdown to the next winter solstice and a sun bar that fills toward midsummer.

## Using it
1. Start the dev server with `pnpm dev` and open the app.
2. Pick a city with the number keys or tap the city buttons.
3. Read the daylight difference and sunrise/sunset for that city.

## Dev notes
- City data and UI live in `src/App.tsx`.
- Calculations are in `src/utils/calculateDaylightPrecise.ts`.
- Styling is in `src/App.css`.
- `docs/PLAN.md` tracks the small todo list.
