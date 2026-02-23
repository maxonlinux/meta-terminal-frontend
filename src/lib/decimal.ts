import Decimal from "decimal.js";

export function formatDecimal(value: Decimal.Value, decimals: number): string {
  const d = new Decimal(value);
  const rounded = d.toDecimalPlaces(decimals, Decimal.ROUND_DOWN);
  if (!d.isZero() && rounded.isZero()) {
    const minUnit = new Decimal(1).div(new Decimal(10).pow(decimals));
    const sign = d.isNegative() ? "-" : "";
    return `${sign}0<${minUnit.toFixed(decimals)}`;
  }
  return rounded.toFixed(decimals);
}

export function formatDecimalOrDash(
  value: Decimal.Value,
  decimals: number,
): string {
  const d = new Decimal(value);
  if (d.isZero()) return "--";
  return formatDecimal(d, decimals);
}

export function formatSignedDecimal(
  value: Decimal.Value,
  decimals: number,
): string {
  const d = new Decimal(value);
  const sign = d.isNegative() ? "-" : "+";
  return `${sign}${formatDecimal(d.abs(), decimals)}`;
}
