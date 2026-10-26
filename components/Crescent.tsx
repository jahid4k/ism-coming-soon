import { useId } from "react";

/** The crescent from the Tadabbur Studio lockup. Colour comes from `currentColor`. */
export function Crescent({ size = 28 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <mask id={id}>
        <rect width="24" height="24" fill="#fff" />
        <circle cx="16.2" cy="8.4" r="8.4" fill="#000" />
      </mask>
      <circle cx="12" cy="12" r="10" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}
