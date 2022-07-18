export function addLeadingZeros(num: number, totalLength: number): string {
  return String(num).padStart(totalLength, '0');
}

export function filterObject(obj, keys): any {
  return Object.fromEntries(Object.entries(obj).filter((m) => keys.includes(m[0])));
}
