import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import calculateDaylight from "./utils/calculateDaylight";
import calculateDaylightPrecise from "./utils/calculateDaylightPrecise";

type DaylightPreciseResult = {
  daylightHours: number;
  sunrise: string;
  sunset: string;
};

type City = {
  name: string;
  latitude: number;
};

type SunTimes = {
  sunrise: string;
  sunset: string;
};

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [preciseTimes, setPreciseTimes] =
    useState<DaylightPreciseResult | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 9,
  });
  const [lightHeight, setLightHeight] = useState(() => {
    const now = new Date();
    const longest = new Date(now.getFullYear(), 5, 21);
    const start = new Date(now.getFullYear(), 0, 1);
    const total = (longest.getTime() - start.getTime()) / 86400000;
    const current = (now.getTime() - start.getTime()) / 86400000;
    return Math.min((current / total) * 100, 100);
  });
  const [result, setResult] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const solstice = new Date(now.getFullYear(), 11, 21, 0, 0, 0);
      const target =
        now > solstice ? new Date(now.getFullYear() + 1, 11, 21) : solstice;
      const diff = target.getTime() - now.getTime();
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateLightHeight = () => {
      const now = new Date();
      const longest = new Date(now.getFullYear(), 5, 21);
      const start = new Date(now.getFullYear(), 0, 1);
      const total = (longest.getTime() - start.getTime()) / 86400000;
      const current = (now.getTime() - start.getTime()) / 86400000;
      setLightHeight(Math.min((current / total) * 100, 100));
    };

    updateLightHeight();
  }, []);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const cities = useMemo<City[]>(
    () => [
      { name: "Oslo", latitude: 59.9139 },
      { name: "Bergen", latitude: 60.3913 },
      { name: "Trondheim", latitude: 63.4305 },
      { name: "Tromsø", latitude: 69.6496 },
      { name: "Stavanger", latitude: 58.9699 },
      { name: "Kristiansand", latitude: 58.0848 },
      { name: "Fredrikstad", latitude: 59.135 },
      { name: "Longyearbyen", latitude: 78.2167 },
    ],
    [],
  );

  const selectCity = useCallback(
    async (index: number) => {
      const city = cities[index];
      const winterDaylight = calculateDaylight(2024, 12, 21, city.latitude);
      const now = new Date();
      const currentDaylight = calculateDaylight(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        city.latitude,
      );
      const winterPrecise = calculateDaylightPrecise(2024, 12, 21, city.latitude);
      const currentPrecise = calculateDaylightPrecise(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        city.latitude,
      );

      const diffApprox = currentDaylight - winterDaylight;
      const diffPrecise =
        currentPrecise.daylightHours - winterPrecise.daylightHours;
      const hoursApprox = Math.floor(diffApprox);
      const minutesApprox = Math.round((diffApprox - hoursApprox) * 60);
      const hoursPrecise = Math.floor(diffPrecise);
      const minutesPrecise = Math.round((diffPrecise - hoursPrecise) * 60);

      setResult(
        `In ${city.name}, the day is:\n` +
          `- Approximate: ${diffApprox.toFixed(2)} hours (${hoursApprox}h ${minutesApprox}m) longer\n` +
          `- Precise (NOAA): ${diffPrecise.toFixed(2)} hours (${hoursPrecise}h ${minutesPrecise}m) longer\n` +
          `- Sunrise (Precise): ${currentPrecise.sunrise}\n` +
          `- Sunset (Precise): ${currentPrecise.sunset}`,
      );
      setPreciseTimes(currentPrecise);

      try {
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${city.latitude}&lng=0&formatted=0`,
        );
        const data = await response.json();
        setSunTimes({
          sunrise: new Date(data.results.sunrise).toLocaleTimeString(),
          sunset: new Date(data.results.sunset).toLocaleTimeString(),
        });
      } catch {
        setSunTimes(null);
      }
    },
    [cities],
  );

  useEffect(() => {
    if (isTouchDevice) return;

    const handler = (event: KeyboardEvent) => {
      const choice = parseInt(event.key, 10);
      if (choice >= 1 && choice <= cities.length) {
        selectCity(choice - 1);
      }
    };

    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  }, [cities, isTouchDevice, selectCity]);

  return (
    <div className="main-bg">
      <div className="card">
        <h1>Winter Solstice Calculator</h1>
        <p className="timestamp" data-testid="current-date-time">
          Current day, date, and time: {currentTime.toLocaleString()}
        </p>
        <p className="subtitle">Choose a city to see how much longer the day is:</p>
        {isTouchDevice ? (
          <div className="city-grid">
            {cities.map((city, index) => (
              <button
                key={city.name}
                className="city-btn"
                onClick={() => selectCity(index)}
              >
                {city.name}
              </button>
            ))}
          </div>
        ) : (
          <ul className="city-list">
            {cities.map((city, index) => (
              <li key={city.name} onClick={() => selectCity(index)}>
                Press <strong>{index + 1}</strong> for {city.name}
              </li>
            ))}
          </ul>
        )}
        {result && (
          <div className="result">
            {result.split("\n").map((line, idx) => (
              <p key={`${line}-${idx}`}>{line}</p>
            ))}
          </div>
        )}
        {sunTimes && preciseTimes && (
          <div className="sun-info">
            <p>Sunrise (API): {sunTimes.sunrise}</p>
            <p>
              Sunrise (Precise): {preciseTimes.sunrise || "N/A"}
            </p>
            <p>Sunset (API): {sunTimes.sunset}</p>
            <p>Sunset (Precise): {preciseTimes.sunset || "N/A"}</p>
          </div>
        )}
        <div className="countdown">
          Countdown to Winter Solstice:{" "}
          <span data-testid="solstice-countdown">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
            {countdown.seconds}s
          </span>
        </div>
        <div className="sun-container">
          <div className="sun-light" style={{ height: `${lightHeight}%` }} />
        </div>
      </div>
    </div>
  );
};

export default App;
