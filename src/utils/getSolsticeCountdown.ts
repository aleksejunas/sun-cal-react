export function getSolsticeCountdown(now: Date) {
  const solstice = new Date(now.getFullYear(), 11, 21);
  const target =
    now > solstice ? new Date(now.getFullYear() + 1, 11, 21) : solstice;
  const diff = target.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
