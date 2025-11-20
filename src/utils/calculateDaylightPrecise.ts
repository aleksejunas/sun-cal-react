/**
 * Calculates the number of daylight hours for a given date and latitude
 * using NOAA's solar position formulas for higher accuracy
 *
 * @param {number} year - The year (e.g. 2024)
 * @param {number} month - The month (1-12)
 * @param {number} day - The day of the month (1-31)
 * @param {number} latitude - Latitude in degrees (positive for north, negative for south)
 * @returns {{ daylightHours: number, sunrise: string, sunset: string}} The number of daylight hours for the specified date and latitude
 */

type DaylightPreciseResult = {
  daylightHours: number;
  sunrise: string;
  sunset: string;
};

const calculateDaylightPrecise = (
  year: number,
  month: number,
  day: number,
  latitude: number,
): DaylightPreciseResult => {
  const latRad = (latitude * Math.PI) / 180;
  const N1 = Math.floor((275 * month) / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const julianDay = N1 - N2 * N3 + day - 30;

  const gamma = ((2 * Math.PI) / 365) * (julianDay - 1);
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.072057 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const cosH = -Math.tan(latRad) * Math.tan(decl);
  let daylightHours = 0;
  if (cosH >= 1) daylightHours = 0;
  else if (cosH <= -1) daylightHours = 24;
  else {
    const H = Math.acos(cosH);
    daylightHours = (2 * H * 180) / Math.PI / 15;
  }

  // Placeholder for sunrise/sunset
  return {
    daylightHours,
    sunrise: "",
    sunset: "",
  };
};

export default calculateDaylightPrecise;
