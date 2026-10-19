/**
 * Placeholder lockup built from live text: اسم (Amiri Bold) plus the dot, then the wordmark.
 * Swap for the real SVG from your logo kit when you want pixel-exact output.
 */
export function Logo() {
  return (
    <span className="logo" role="img" aria-label="99 Names">
      <span className="logo-mark ar" lang="ar" dir="rtl" aria-hidden="true">
        اسم
        <i className="logo-dot" />
      </span>
      <span className="logo-word" aria-hidden="true">
        99 Names
      </span>
    </span>
  );
}
