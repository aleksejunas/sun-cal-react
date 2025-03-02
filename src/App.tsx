import React, { useState, useEffect, useMemo } from "react";

// Define the City type
type City = {
  name: string;
  latitude: number;
};

// Function to calculate daylight duration in hours
const calculateDaylight = (
  year: number,
  month: number,
  day: number,
  latitude: number,
): number => {
  const latRad = (latitude * Math.PI) / 180.0;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29; // Leap year
  }
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  const declination =
    ((23.45 * Math.PI) / 180.0) *
    Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);

  // Handle edge cases for polar night and midnight sun
  const tanLatTanDecl = -Math.tan(latRad) * Math.tan(declination);
  if (tanLatTanDecl >= 1.0) {
    // Polar night: Sun never rises
    return 0.0;
  } else if (tanLatTanDecl <= -1.0) {
    // Midnight sun: Sun never sets
    return 24.0;
  } else {
    // Normal daylight calculation
    const hourAngle = Math.acos(tanLatTanDecl);
    const daylightHours = (2 * hourAngle * 180) / Math.PI / 15;
    return daylightHours;
  }
};

const App: React.FC = () => {
  const [result, setResult] = useState<string>("");

  // Define the winter solstice date
  const winterSolsticeYear = 2024;
  const winterSolsticeMonth = 12;
  const winterSolsticeDay = 21;

  // Get the current date and time
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Memoize the cities array to prevent unnecessary re-renders
  const cities: City[] = useMemo(
    () => [
      { name: "Oslo", latitude: 59.9139 },
      { name: "Bergen", latitude: 60.3913 },
      { name: "Trondheim", latitude: 63.4305 },
      { name: "Tromsø", latitude: 69.6496 },
      { name: "Stavanger", latitude: 58.9699 },
      { name: "Kristiansand", latitude: 58.0848 },
      { name: "Fredrikstad", latitude: 59.135 },
    ],
    [],
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      const choice = parseInt(key, 10);

      if (choice >= 1 && choice <= cities.length) {
        const selectedCity = cities[choice - 1];

        // Calculate daylight for winter solstice
        const winterDaylight = calculateDaylight(
          winterSolsticeYear,
          winterSolsticeMonth,
          winterSolsticeDay,
          selectedCity.latitude,
        );

        // Calculate daylight for current date
        const currentDaylight = calculateDaylight(
          currentYear,
          currentMonth,
          currentDay,
          selectedCity.latitude,
        );

        // Calculate the difference
        const daylightDifference = currentDaylight - winterDaylight;
        const hours = Math.floor(daylightDifference);
        const minutes = Math.round((daylightDifference - hours) * 60);

        setResult(
          `In ${selectedCity.name}, the day is ${daylightDifference.toFixed(
            2,
          )} hours (${hours} hours and ${minutes} minutes) longer than on the winter solstice.`,
        );
      }
    };

    // Add event listener for keypress
    window.addEventListener("keypress", handleKeyPress);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [
    cities,
    currentDay,
    currentMonth,
    currentYear,
    winterSolsticeDay,
    winterSolsticeMonth,
    winterSolsticeYear,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Winter Solstice Calculator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="mb-4">
          Current day, date, and time: {now.toLocaleString()}
        </p>
        <p className="mb-4">Choose a city to see how much longer the day is:</p>
        <ul className="mb-4">
          {cities.map((city, index) => (
            <li key={index} className="mb-2">
              Press <strong>{index + 1}</strong> for {city.name}
            </li>
          ))}
        </ul>
        {result && <p className="mt-4 text-center">{result}</p>}
      </div>
    </div>
  );
};

export default App;
