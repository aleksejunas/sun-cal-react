import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import calculateDaylightPrecise from "./utils/calculateDaylightPrecise";

// TODO: Alter background after time of day (Blue sky's etc.)
// TODO: Add dark mode
// TODO: Make the application more modular
// TODO: Move language
// TODO: Add support for multiple languages utilizing the 'react-i18next' library

type DaylightPreciseResult = {
  daylightHours: number;
  sunrise: string;
  sunset: string;
};

type City = {
  name: string;
  latitude: number;
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
  const [dark, setDark] = useState(true);

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
      const now = new Date();
      const winterPrecise = calculateDaylightPrecise(
        2024,
        12,
        21,
        city.latitude,
      );
      const currentPrecise = calculateDaylightPrecise(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        city.latitude,
      );

      const diffPrecise =
        currentPrecise.daylightHours - winterPrecise.daylightHours;
      const hoursPrecise = Math.floor(diffPrecise);
      const minutesPrecise = Math.round((diffPrecise - hoursPrecise) * 60);

      setResult(
        `${city.name}: Dagen er (${hoursPrecise}h ${minutesPrecise}m)` +
          ` ${diffPrecise.toFixed(2)} timer  lengre enn ved vintersolverv`,
      );
      setPreciseTimes(currentPrecise);
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
    <div className={dark ? "dark" : ""}>
      <div className="main-bg w-[100vw] h-[100vh]">
        <div
          role="button"
          aria-label={dark ? "Bytt til lys modus" : "Bytt til mørk modus"}
          aria-pressed={dark}
          onClick={() => setDark(!dark)}
          className="theme-toggle-btn"
        >
          {dark ? "🌛" : "🌞"}
        </div>
        <div className="card w-[70vw] h- [70vh]">
          <h1 className="main-title">
            <span className="snowflake">❄</span> Vintersolverv Kalkulator{" "}
          </h1>

          <p className="timestamp" data-testid="current-date-time">
            {currentTime.toLocaleDateString()}
            <span className="dot"> • </span>
            {currentTime.toLocaleTimeString()}
          </p>

          <p className="subtitle">
            Velg en by for å sjekke hvor mye lengre dagen er nå
          </p>
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
            <div className="city-grid">
              {cities.map((city, index) => (
                <button
                  key={city.name}
                  className="city-btn"
                  onClick={() => selectCity(index)}
                >
                  <strong>{index + 1}</strong> · {city.name}
                </button>
              ))}
            </div>
          )}
          {(result || preciseTimes) && (
            <div className="info-group">
              {result && (
                <div className="info-line">
                  {result.split("\n").map((line, idx) => (
                    <p key={`${line}-${idx}`}>{line}</p>
                  ))}
                </div>
              )}

              {preciseTimes && (
                <div className="info-line">
                  <p>Sol opp: {preciseTimes.sunrise || "N/A"}</p>
                  <p>Sol ned: {preciseTimes.sunset || "N/A"}</p>
                </div>
              )}
            </div>
          )}
          <div className="countdown">
            Nedtelling til vintersolverv:{" "}
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
    </div>
  );
};

export default App;
