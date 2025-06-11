export function rewardTokens(ev, position = 1, supplyWeight = 1) {
  const max = 10;
  const k = 0.1;
  const logistic = 1 / (1 + Math.exp(-k * (position - 50)));
  return Math.round(ev * logistic * supplyWeight * max);
}
