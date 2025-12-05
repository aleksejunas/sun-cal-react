/* ****
 * utils/daylightDifference.14:43:33
 *
 * - Takes in a date and latitude,
 * - Calculates the length of the current day
 * - Calculates the length of the winter-solstice day
 * - Calculates the diff in hours and minutes
 *
 ***** */

import calculateDaylightPrecise from "./calculateDaylightPrecise";

export function getDaylightDifference(date: Date, latitude: number) {
  const winter = calculateDaylightPrecise(date.getFullYear(), 12, 21, latitude);

  const today = calculateDaylightPrecise(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    latitude,
  );

  const diff = today.daylightHours - winter.daylightHours;

  // const h = Math.floor(diff);
  // const m = Math.round((diff - h) * 60);

  return {
    winter,
    today,
    diff,
    diffHours: Math.floor(diff),
    diffMinutes: Math.round((diff - Math.floor(diff)) * 60),
  };
}
