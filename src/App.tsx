import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { calculateDaylight } from "./utils/calculateDaylight";

// -- STYLING --
// TODO: Style the app like the box for the moon moon boxes box HA HA!
// TODO: Make a nice css animation for the sun

// Nice Colors to use: #87CEEB, #FFA500, #FF4500, #FFB6C1, #191970, #FDFD96, #D3D3D3
// Change the background color on differtent times of the day
// And of course the color palette from the moon boxes box

// -- Commiting --
// TODO: Lage en counter som teller ned til vintersolverv med dager, timer, minutter og sekunder
type City = {
  name: string;
  latitude: number;
};

const App: React.FC = () => {
  const [lightHeight, setLightHeight] = useState<number>(() => {
    const now = new Date();
    const longestDay = new Date(now.getFullYear(), 5, 21); // June 21st
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const totalDays =
      (longestDay.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const currentDays =
      (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min((currentDays / totalDays) * 100, 100);
  });

  const [result, setResult] = useState<string>("");
  // const [daylightPercentage, setDaylightPercentage] = useState<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [sunTimes, setSunTimes] = useState<{
    sunrise: string;
    sunset: string;
  } | null>(null);

  useEffect(() => {
    const calculateLightHeight = () => {
      const now = new Date();
      const longestDay = new Date(now.getFullYear(), 5, 21); // June 21st
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const totalDays =
        (longestDay.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const currentDays =
        (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const percentage = Math.min((currentDays / totalDays) * 100, 100);
      setLightHeight(percentage);
    };

    calculateLightHeight();
  }, []);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    };
    checkTouchDevice();
  }, []);

  // const now = new Date();
  // const currentYear = now.getFullYear();
  // const currentMonth = now.getMonth() + 1;
  // const currentDay = now.getDate();

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

  const now = useMemo(() => new Date(), []);

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

      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

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
        )} hours (${hours} hours and ${minutes} minutes) longer.`,
      );

      try {
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${selectedCity.latitude}&lng=0&formatted=0`,
        );
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();

        setSunTimes({
          sunrise: new Date(data.results.sunrise).toLocaleTimeString(),
          sunset: new Date(data.results.sunset).toLocaleTimeString(),
        });
      } catch (error) {
        console.error(error);
        setSunTimes(null);
      }
    },
    [cities, now],
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
      <div className="bg-blue-300 p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="mb-4" data-testid="current-date-time">
          Current day, date, and time: {now.toLocaleString()}
        </p>
        <p className="mb-4">Choose a city to see how much longer the day is:</p>

        {isTouchDevice ? (
          // Render buttons for touchscreen devices
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city, index) => (
              <button
                key={index}
                className="bg-yellow-300 text-white p-2 rounded-md text-center"
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
            className="sun-light"
            style={{ height: `${lightHeight}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default App;
