import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { getSolsticeCountdown } from "./utils/getSolsticeCountdown";
import { getDaylightDifference } from "./utils/daylightDifference";
import { getSeasonInfo } from "./utils/getSeasonInfo";

// TODO: Alter background after time of day (Blue sky's etc.)
// TODO: Add dark mode
// TODO: Make the application more modular
// TODO: Move language
// TODO: Add support for multiple languages utilizing the 'react-i18next' library

// DEV ONLY: Mock the current date for testing
// Uncomment one of the following blocks as needed:

// --- To test BEFORE winter solstice (e.g., Dec 20) ---
// class MockDate extends Date {
//   constructor(...args: ConstructorParameters<typeof Date>) {
//     if (args.length === 0) {
//       super("2025-12-20T12:00:00Z");
//     }
//     return new Date(...args);
//   }
//   static now() {
//     return new Date("2025-12-20T12:00:00Z").getTime();
//   }
// }
// window.Date = MockDate as unknown as DateConstructor;

// --- To test AFTER winter solstice (e.g., Dec 22) ---
// class MockDate extends Date {
//   constructor(...args: [] | ConstructorParameters<typeof Date>) {
//     super(
//       ...((args.length === 0
//         ? ["2025-12-22T12:00:00Z"]
//         : args) as ConstructorParameters<typeof Date>),
//     );
//   }
//   static now() {
//     return new Date("2025-12-22T12:00:00Z").getTime();
//   }
// }
// window.Date = MockDate as unknown as DateConstructor;

// ----- Ticking MockDate: advances time in real seconds from a fixed start maxTouchPoints

// const REAL_Date = Date;
// const REAL_Date_now = Date.now;
//
// const MOCK_START_ISO = "2025-12-22T12:00:00Z";
// const MOCK_START_REAL = REAL_Date.now();
// const MOCK_START_TIME = new Date(MOCK_START_ISO).getTime();
//
// class TickingMockDate extends Date {
//   constructor(...args: [] | ConstructorParameters<typeof Date>) {
//     if (args.length === 0) {
//       // Advance mock time by real elapsed ms since load
//       super(MOCK_START_TIME + (REAL_Date_now() - MOCK_START_REAL));
//     } else {
//       super(...args);
//     }
//   }
//   static now() {
//     return MOCK_START_TIME + (Date.now() - MOCK_START_REAL);
//   }
// }
// window.Date = TickingMockDate as unknown as DateConstructor;
// // @ts-expect-error: Overriding Date.now with mock implementation
// Date.no = TickingMockDate.now as unknown as () => number;

type SunTimesResult = {
  sunrise: string;
  sunset: string;
};

type City = {
  name: string;
  latitude: number;
  longitude: number;
};

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [preciseTimes, setPreciseTimes] = useState<SunTimesResult | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme-dark");
    if (stored !== null) return stored === "true";
    // Default to dark, but check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return false;
    }
    return true;
  });

  const [showThemePrompt, setShowThemePrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme-dark");
    if (
      stored === null &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      setShowThemePrompt(true);
    }
  }, []);

  const [seasonInfo, setSeasonInfo] = useState(() => getSeasonInfo(new Date()));

  useEffect(() => {
    localStorage.setItem("theme-dark", dark.toString());
  }, [dark]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSeason = () => setSeasonInfo(getSeasonInfo(new Date()));
    updateSeason();
    const interval = setInterval(updateSeason, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      setCountdown(getSolsticeCountdown(now, seasonInfo.nextSolstice));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [seasonInfo.nextSolstice]);

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
      { name: "Oslo", latitude: 59.9139, longitude: 10.757933 },
      { name: "Bergen", latitude: 60.3913, longitude: 5.32415 },
      { name: "Trondheim", latitude: 63.4305, longitude: 10.39506 },
      { name: "Tromsø", latitude: 69.6496, longitude: 18.95508 },
      { name: "Stavanger", latitude: 58.9699, longitude: 5.73332 },
      { name: "Kristiansand", latitude: 58.0848, longitude: 7.9956 },
      { name: "Fredrikstad", latitude: 59.135, longitude: 10.9298 },
      { name: "Longyearbyen", latitude: 78.2167, longitude: 15.64689 },
    ],
    [],
  );

  const selectCity = useCallback(
    (index: number) => {
      const city = cities[index];
      const now = currentTime;

      const { today, diff, diffHours, diffMinutes } = getDaylightDifference(
        now,
        city.latitude,
        city.longitude,
      );

      setResult(
        `${city.name}: Dagen er (${diffHours}h ${diffMinutes}m) ${diff.toFixed(
          2,
        )} timer lengre enn ved vintersolverv`,
      );

      setPreciseTimes({ sunrise: today.sunrise, sunset: today.sunset });
    },
    [cities, currentTime],
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

  // Theme class logic
  const themeClass = dark
    ? seasonInfo.label === "sommersolverv"
      ? "summer-dark"
      : "dark"
    : seasonInfo.label === "sommersolverv"
      ? "summer"
      : "";

  return (
    <div className={themeClass}>
      <div className="main-bg min-h-screen">
        {showThemePrompt && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.55",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#222",
                color: "#fff",
                padding: "2rem",
                borderRadius: "1.5rem",
                // margin: "1rem auto",
                maxWidth: 400,
                width: "90%",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Ser at du bruker lyst systemtema. Vil du prøve vårt mørke tema?
                Det ser best ut!
              </p>
              <button
                style={{
                  margin: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "#444",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setDark(true);
                  setShowThemePrompt(false);
                }}
              >
                Ja, bruk mørkt tema
              </button>
              <button
                style={{
                  margin: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "#eee",
                  color: "#222",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setDark(false);
                  setShowThemePrompt(false);
                }}
              >
                Nei takk, hold lyst tema
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="header-spacer"></div>
            <div
              role="button"
              aria-label={dark ? "Bytt til lys modus" : "Bytt til mørk modus"}
              aria-pressed={dark}
              onClick={() => setDark(!dark)}
              className="theme-toggle-btn"
            >
              {dark ? "🌛" : "🌞"}
            </div>
            <h1 className="main-title">
              Solstice Tracker{" "}
              <span className="snowflake">
                {seasonInfo.label === "sommersolverv" ? "☀️" : "❄"}
              </span>
            </h1>
          </div>
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
            Nedtelling til {seasonInfo.label}:{" "}
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
