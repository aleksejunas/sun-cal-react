export const calculateDaylight = (
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
