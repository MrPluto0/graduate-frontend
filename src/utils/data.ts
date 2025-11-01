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

/**
 * 将 bit 转换为 MB
 * @param bits - 比特数
 * @param precision - 精度（小数位数），默认为 2
 * @returns MB 数值
 */
export function bitToMB(bits: number, precision = 2): number {
  const mb = bits / (8 * 1024 * 1024);
  return round(mb, precision);
}

/**
 * 将 MB 转换为 bit
 * @param mb - MB 数值
 * @returns bit 数值
 */
export function mbToBit(mb: number): number {
  return mb * 8 * 1024 * 1024;
}