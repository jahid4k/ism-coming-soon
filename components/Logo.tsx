import { Crescent } from "./Crescent";

/**
 * Tadabbur Studio lockup, built from live text: the crescent plus تَدَبُّر in Amiri Bold.
 * Swap for an exported SVG from the canvas if you want it pixel-exact.
 */
export function Logo() {
  return (
    <span className="logo" role="img" aria-label="Tadabbur Studio">
      <Crescent size={28} />
      <span className="ar" lang="ar" dir="rtl" aria-hidden="true">
        تَدَبُّر
      </span>
      <span className="logo-word" aria-hidden="true">
        Studio
      </span>
    </span>
  );
}
