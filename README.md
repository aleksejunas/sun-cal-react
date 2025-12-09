# Winter Solstice Calculator

Application is live at: [Winter Solstice Calculator](https://winter-solstice-calculator.vercel.app/)

Single-page React app that compares today's daylight to the winter solstice for a handful of Norwegian cities. Sunrise/sunset times are calculated with the excellent `suncalc` library for high precision.

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
- Daylight math is handled by `src/utils/getSunTimes.ts` and `src/utils/daylightDifference.ts`.
- The calculations rely on the `suncalc` library to provide high-accuracy solar positioning and timing, which corrects for factors like the Equation of Time.
