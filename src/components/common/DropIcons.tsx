"use client";

export function DropUpIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m280-400 200-200 200 200H280Z" />
    </svg>
  );
}

export function DropDownIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M480-360 280-560h400L480-360Z" />
    </svg>
  );
}
