/**
 * Calculates the number of daylight hours for a given date and latitude
 *
 * Uses astronomical formulas to estimate the length of the day (in hours)
 * based on Earth's axial tilt and postion in orbit.
 *
 * @param {number} year - The year (e.g. 2024)
 * @param {number} month - The month (1-12)
 * @param {number} day - The day of the month (1-31)
 * @param {number} latitude - The latitude in degrees (positive for north, negative for south)
 * @returns {number} The number of daylight hours for the specified date and latitude
 */

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

export default calculateDaylight;
