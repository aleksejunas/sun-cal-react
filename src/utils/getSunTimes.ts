import SunCalc from "suncalc";

export type SunTimesResult = {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  nadir: string;
  sunriseEnd: string;
  sunsetStart: string;
  dawn: string;
  dusk: string;
  nauticalDawn: string;
  nauticalDusk: string;
  nightEnd: string;
  night: string;
  goldenHourEnd: string;
  goldenHour: string;
};

const getSunTimes = (
  date: Date,
  latitude: number,
  longitude: number,
): SunTimesResult => {
  const times = SunCalc.getTimes(date, latitude, longitude);

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    sunrise: formatTime(times.sunrise),
    sunset: formatTime(times.sunset),
    solarNoon: formatTime(times.solarNoon),
    nadir: formatTime(times.nadir),
    sunriseEnd: formatTime(times.sunriseEnd),
    sunsetStart: formatTime(times.sunsetStart),
    dawn: formatTime(times.dawn),
    dusk: formatTime(times.dusk),
    nauticalDawn: formatTime(times.nauticalDawn),
    nauticalDusk: formatTime(times.nauticalDusk),
    nightEnd: formatTime(times.nightEnd),
    night: formatTime(times.night),
    goldenHourEnd: formatTime(times.goldenHourEnd),
    goldenHour: formatTime(times.goldenHour),
  };
};

export default getSunTimes;