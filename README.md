# Winter Solstice Calculator

Application is live at: [Winter Solstice Calculator](https://winter-solstice-calculator.vercel.app/)


Single-page React app that compares today's daylight to the winter solstice for a handful of Norwegian cities. Calculations and sunrise/sunset times come from the local NOAA-based helper, so it works offline without any external API calls.

## How it works
- Pick a city with the number keys (1–8) or tap the buttons on touch devices.
- The app shows how much longer today is than December 21, along with sunrise and sunset for the selected city.
- A small countdown tracks time left until the next winter solstice, and the sun bar fills as we move toward midsummer.

## Running it
```
pnpm install
pnpm dev    # start Vite dev server
pnpm build  # type-check + production build
pnpm test   # run tests
```

## Notes
- City list and UI live in `src/App.tsx`.
- Daylight math is in `src/utils/calculateDaylightPrecise.ts`.
- The daylight math uses a standard NOAA-based formula; I didn’t invent it, but I verified it locally and rely on it for sunrise/sunset as well.
