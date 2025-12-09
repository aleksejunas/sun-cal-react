import getSunTimes from "./getSunTimes";

export function getDaylightDifference(
  date: Date,
  latitude: number,
  longitude: number,
) {
  const winterSolsticeDate = new Date(date.getFullYear(), 11, 21); // December 21st
  const winterTimes = getSunTimes(winterSolsticeDate, latitude, longitude);

  const todayTimes = getSunTimes(date, latitude, longitude);

  const parseTime = (timeString: string, baseDate: Date): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const winterSunrise = parseTime(winterTimes.sunrise, winterSolsticeDate);
  const winterSunset = parseTime(winterTimes.sunset, winterSolsticeDate);
  const todaySunrise = parseTime(todayTimes.sunrise, date);
  const todaySunset = parseTime(todayTimes.sunset, date);

  const winterDaylightMs = winterSunset.getTime() - winterSunrise.getTime();
  const todayDaylightMs = todaySunset.getTime() - todaySunrise.getTime();

  const winterDaylightHours = winterDaylightMs / (1000 * 60 * 60);
  const todayDaylightHours = todayDaylightMs / (1000 * 60 * 60);

  const diff = todayDaylightHours - winterDaylightHours;

  return {
    winter: {
      sunrise: winterTimes.sunrise,
      sunset: winterTimes.sunset,
      daylightHours: winterDaylightHours,
    },
    today: {
      sunrise: todayTimes.sunrise,
      sunset: todayTimes.sunset,
      daylightHours: todayDaylightHours,
    },
    diff,
    diffHours: Math.floor(diff),
    diffMinutes: Math.round((diff - Math.floor(diff)) * 60),
  };
}
