import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_DOWN });

export function toDecimal(value: string | number): Decimal {
  return new Decimal(value);
}

export function add(a: string, b: string): string {
  return toDecimal(a).plus(toDecimal(b)).toString();
}

export function sub(a: string, b: string): string {
  return toDecimal(a).minus(toDecimal(b)).toString();
}

export function mul(a: string, b: string): string {
  return toDecimal(a).times(toDecimal(b)).toString();
}

export function div(a: string, b: string): string {
  return toDecimal(a).dividedBy(toDecimal(b)).toString();
}

export function formatDec(
  value: string,
  decimals: number,
  options?: { trim?: boolean; pad?: boolean },
): string {
  const d = toDecimal(value);
  if (d.isZero()) return "0";

  const intPart = d.floor().toString();
  const fracPart = d
    .minus(d.floor())
    .mul(new Decimal(10).pow(decimals))
    .floor()
    .toString();

  if (decimals === 0) return intPart;

  const padded = fracPart.padStart(decimals, "0");

  if (options?.trim) {
    const trimmed = padded.replace(/\.?0+$/, "");
    return trimmed ? `${intPart}.${trimmed}` : intPart;
  }

  if (!options?.pad) {
    const trimmed = padded.replace(/\.?0+$/, "");
    if (trimmed) return `${intPart}.${trimmed}`;
  }

  return `${intPart}.${padded}`;
}

export function gt(a: string, b: string): boolean {
  return toDecimal(a).greaterThan(toDecimal(b));
}

export function gte(a: string, b: string): boolean {
  return toDecimal(a).greaterThanOrEqualTo(toDecimal(b));
}

export function lt(a: string, b: string): boolean {
  return toDecimal(a).lessThan(toDecimal(b));
}

export function lte(a: string, b: string): boolean {
  return toDecimal(a).lessThanOrEqualTo(toDecimal(b));
}

export function eq(a: string, b: string): boolean {
  return toDecimal(a).equals(toDecimal(b));
}

export function isZero(value: string): boolean {
  return toDecimal(value).isZero();
}

export function isPositive(value: string): boolean {
  return toDecimal(value).greaterThan(0);
}
