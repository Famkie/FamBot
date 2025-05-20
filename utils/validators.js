export function isValidPrize(prize) {
  return /^[\d]+[km]?$/i.test(prize);
}

export function parsePrize(prize) {
  const num = parseInt(prize);
  if (prize.toLowerCase().endsWith('m')) return num * 1_000_000;
  if (prize.toLowerCase().endsWith('k')) return num * 1_000;
  return num;
}
