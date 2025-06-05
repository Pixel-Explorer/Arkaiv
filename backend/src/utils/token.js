export function rewardTokens(ev, weights = []) {
  const avg = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 1;
  return Math.round(ev * avg);
}
