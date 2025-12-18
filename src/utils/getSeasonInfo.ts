// src/utils/getSeasonInfo.ts

// interface getSeasonInfo {
//   season: Season;
//   nextSolstice: Date;
//   label: string;
// }

export type Season = "winter" | "summer";

export function getSeasonInfo(now: Date): {
  season: Season;
  nextSolstice: Date;
  label: string;
} {
  const year = now.getFullYear();
  const winterSolstice = new Date(year, 11, 21); // Dec 21
  const summerSolstice = new Date(year, 5, 21); // June 21

  if (now >= winterSolstice || now < summerSolstice) {
    // After Dec 21 or before June 21: count to summer winterSolstice
    const next =
      now < summerSolstice ? summerSolstice : new Date(year + 1, 5, 21);
    return {
      season: "winter",
      nextSolstice: next,
      label: "sommersolverv",
    };
  } else {
    // After June 21, before Dec 21: count to winter solstice
    return {
      season: "summer",
      nextSolstice: winterSolstice,
      label: "vintersolverv",
    };
  }
}
