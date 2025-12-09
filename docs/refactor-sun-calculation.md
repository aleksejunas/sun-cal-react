# Refactoring Sun Calculation Logic

## Summary
This document outlines the refactoring of the sunrise and sunset calculation logic. The original, simplified mathematical model has been replaced with the `suncalc` library to provide significantly more accurate solar times.

## Why the Change Was Necessary
The previous implementation for calculating sunrise and sunset had a noticeable discrepancy when compared to authoritative sources like `timeanddate.no`. The user reported an 18-minute difference in the calculated sunset time.

The root cause of this inaccuracy was the simplified nature of the original algorithm. It did not account for two critical astronomical factors:
1.  **The Equation of Time**: This accounts for the variance between "clock time" and "solar time," caused by the Earth's axial tilt and elliptical orbit. This alone can cause a deviation of up to ±16 minutes.
2.  **Observer's Longitude**: The original calculation did not use the city's longitude. It assumed solar noon was at exactly 12:00 local time, which is only true for locations on a timezone's standard meridian.

## What Was Changed
To resolve these inaccuracies, the `suncalc` library was integrated into the project. `suncalc` is a robust, well-tested library that performs high-accuracy calculations for sun and moon positions.

### Detailed Changes:
1.  **Dependency Added**: `suncalc` and its corresponding type definitions (`@types/suncalc`) were added to the project's dependencies.

2.  **Added Longitude Data**: The `cities` array in `src/App.tsx` was updated to include the `longitude` for each city, which is a required parameter for `suncalc`.

3.  **New Utility `getSunTimes.ts`**: A new utility file was created at `src/utils/getSunTimes.ts`. This file exports a function that takes a date, latitude, and longitude, and returns accurately formatted sunrise and sunset times using `suncalc`.

4.  **Refactored `daylightDifference.ts`**: The core logic in `src/utils/daylightDifference.ts` was updated to use the new `getSunTimes` function. It now calculates the difference in daylight hours based on the precise sunrise and sunset times returned by `suncalc`.

5.  **Removed Obsolete Code**: The old, inaccurate calculation file, `src/utils/calculateDaylightPrecise.ts`, was deleted from the project.

6.  **Updated `App.tsx`**: The main component was updated to handle the new data structures and pass the required `longitude` information to the calculation functions.

## Outcome
By implementing `suncalc`, the application's sunrise and sunset times are now far more accurate and align closely with astronomical standards. This provides a more reliable and trustworthy experience for the user.
