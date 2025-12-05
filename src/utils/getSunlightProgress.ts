export function getSunlightProgress(today: Date): number {
  const longest = new Date(today.getFullYear(), 5, 21);
  const start = new Date(today.getFullYear(), 0, 1);

  const total = (longest.getTime() - start.getTime()) / 86400000;
  const current = (today.getTime() - start.getTime()) / 86400000;

  return Math.min((current / total) * 100, 100);
}
