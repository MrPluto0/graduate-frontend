export function round(num: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round(num * factor) / factor;
}
