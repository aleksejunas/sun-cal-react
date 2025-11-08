# Winter Solstice Calculator

## Project Overview

The Winter Solstice Calculator is a web application that compares the current day's daylight hours to those on the winter solstice (December 21) for various Norwegian cities. This allows users to see how much longer the current day is compared to the shortest day of the year.

## Functionality

- Calculates the difference in daylight hours between the current date and the winter solstice (December 21, 2024)
- Displays the difference in hours and minutes
- Fetches real-time sunrise and sunset times using the Sunrise-Sunset API
- Provides both keyboard and touch interfaces for selecting cities

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: CSS with Tailwind CSS
- **API Integration**: Fetch API for sunrise/sunset data
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **Responsive Design**: Adaptive UI for both desktop and touch devices

## Core Components

1. **Daylight Calculation Algorithm**: Mathematical formula that determines daylight hours based on latitude and date
2. **City Selection Interface**: Dynamic interface that adapts between keyboard input and touch controls
3. **API Integration**: Real-time data fetching from the Sunrise-Sunset API
4. **Responsive UI**: Tailwind-based responsive design

## How to Use

### Desktop Users:

1. Launch the application in your browser
2. View the current date and time displayed at the top
3. Press the corresponding number key for the city you want to check:
   - Press `1` for Oslo
   - Press `2` for Bergen
   - Press `3` for Trondheim
   - And so on...
4. View the result showing how much longer today is compared to the winter solstice
5. See the current sunrise and sunset times for the selected city

### Mobile/Touch Device Users:

1. Launch the application in your browser
2. View the current date and time displayed at the top
3. Tap on the city button you want to check from the grid
4. View the result showing how much longer today is compared to the winter solstice
5. See the current sunrise and sunset times for the selected city

## Cities Available

- Oslo
- Bergen
- Trondheim
- Tromsø
- Stavanger
- Kristiansand
- Fredrikstad
- Longyearbyen

## Development Notes

- The app uses the latitude of each city to perform calculations
- The comparison is always against December 21, 2024 (winter solstice)
- The Sunrise-Sunset API is used to fetch accurate sunrise and sunset times
- The UI adapts based on whether the device has touch capabilities

## Future Improvements

- Visual sun animation corresponding to daylight hours
- Dynamic background colors based on time of day
- More cities and international locations
- Historical comparison with previous years
- Seasonal theme changes

## Installation and Running Locally

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm start` to launch the development server
5. Access the app at `http://localhost:3000`
