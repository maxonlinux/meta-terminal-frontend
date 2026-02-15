type ClassValue =
  | string
  | false
  | null
  | undefined
  | { [key: string]: boolean };

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function cls(...args: (ClassValue | undefined)[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === "string") return [arg];
      if (typeof arg === "object") {
        return Object.entries(arg)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}

export const withLeadingPlus = (number: number) =>
  `${number > 0 ? "+" : ""}${number}`;

export function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
