import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";

// TODO: Test the test coverage
// TODO: Style the app
// TODO: Try out creating a pull request

type City = {
  name: string;
  latitude: number;
};

const calculateDaylight = (
  year: number,
  month: number,
  day: number,
  latitude: number,
): number => {
  const latRad = (latitude * Math.PI) / 180.0;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }
  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  const declination =
    ((23.45 * Math.PI) / 180.0) *
    Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365);

  const tanLatTanDecl = -Math.tan(latRad) * Math.tan(declination);
  if (tanLatTanDecl >= 1.0) return 0.0;
  if (tanLatTanDecl <= -1.0) return 24.0;
  const hourAngle = Math.acos(tanLatTanDecl);
  return (2 * hourAngle * 180) / Math.PI / 15;
};

const App: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [daylightPercentage, setDaylightPercentage] = useState<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [sunTimes, setSunTimes] = useState<{
    sunrise: string;
    sunset: string;
  } | null>(null);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    };
    checkTouchDevice();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const cities: City[] = useMemo(
    () => [
      { name: "Oslo", latitude: 59.9139 },
      { name: "Bergen", latitude: 60.3913 },
      { name: "Trondheim", latitude: 63.4305 },
      { name: "Tromsø", latitude: 69.6496 },
      { name: "Stavanger", latitude: 58.9699 },
      { name: "Kristiansand", latitude: 58.0848 },
      { name: "Fredrikstad", latitude: 59.135 },
      { name: "Longyearbyen", latitude: 78.2166658 },
    ],
    [],
  );

  const selectCity = useCallback(
    async (index: number) => {
      const selectedCity = cities[index];

      const winterSolsticeYear = 2024;
      const winterSolsticeMonth = 12;
      const winterSolsticeDay = 21;

      const winterDaylight = calculateDaylight(
        winterSolsticeYear,
        winterSolsticeMonth,
        winterSolsticeDay,
        selectedCity.latitude,
      );

      const currentDaylight = calculateDaylight(
        currentYear,
        currentMonth,
        currentDay,
        selectedCity.latitude,
      );

      const daylightDifference = currentDaylight - winterDaylight;
      const hours = Math.floor(daylightDifference);
      const minutes = Math.round((daylightDifference - hours) * 60);

      setResult(
        `In ${selectedCity.name}, the day is ${daylightDifference.toFixed(
          2,
        )} hours (${hours} hours and ${minutes} minutes) longer than on the winter solstice.`,
      );

      const maxDaylight = 24.0;
      setDaylightPercentage((currentDaylight / maxDaylight) * 100.0);

      // Fetch sunrise and sunset times for the selected city
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${selectedCity.latitude}&lng=0&formatted=0`,
      );
      const data = await response.json();
      setSunTimes({
        sunrise: new Date(data.results.sunrise).toLocaleTimeString(),
        sunset: new Date(data.results.sunset).toLocaleTimeString(),
      });
    },
    [cities, currentDay, currentMonth, currentYear],
  );

  useEffect(() => {
    if (!isTouchDevice) {
      const handleKeyPress = (event: KeyboardEvent) => {
        const key = event.key;
        const choice = parseInt(key, 10);

        if (choice >= 1 && choice <= cities.length) {
          selectCity(choice - 1);
        }
      };

      window.addEventListener("keypress", handleKeyPress);
      return () => window.removeEventListener("keypress", handleKeyPress);
    }
  }, [cities, selectCity, isTouchDevice]);

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Winter Solstice Calculator</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="mb-4">
          Current day, date, and time: {now.toLocaleString()}
        </p>
        <p className="mb-4">Choose a city to see how much longer the day is:</p>

        {isTouchDevice ? (
          // Render buttons for touchscreen devices
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city, index) => (
              <button
                key={index}
                className="bg-blue-500 text-white p-2 rounded-md text-center"
                onClick={() => selectCity(index)}
              >
                {city.name}
              </button>
            ))}
          </div>
        ) : (
          // Render text instructions for keyboard selection
          <ul className="mb-4">
            {cities.map((city, index) => (
              <li
                key={index}
                className="mb-2 cursor-pointer"
                onClick={() => selectCity(index)}
              >
                Press <strong>{index + 1}</strong> for {city.name}
              </li>
            ))}
          </ul>
        )}

        {result && <p className="mt-4 text-center">{result}</p>}

        {sunTimes && (
          <div className="mt-4">
            <p>Sunrise: {sunTimes.sunrise}</p>
            <p>Sunset: {sunTimes.sunset}</p>
          </div>
        )}

        <div className="sun-container mt-4">
          <div
            className="sun"
            style={{ height: `${daylightPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default App;
