export function round(num: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round(num * factor) / factor;
}

export function appendData(obj: {data: any[]}, val: any, maxLen: number = 20) {
  obj.data.push(val);
  if (obj.data.length > maxLen) {
    obj.data.shift();
  }
}