export function formatDaylightMessage(
  cityName: string,
  diffHours: number,
  diffMinutes: number,
  diff: number,
): string {
  return `${cityName}: Dagen er (${diffHours}h ${diffMinutes}m) ${diff.toFixed(2)} timer lengre enn ved vintersolverv`;
}
