import { Crescent } from "./Crescent";

/**
 * A stylised stand-in for the book cover, in the same sky panel as the app.
 * When you have the real cover image, replace this with an <img>.
 */
export function BookCover() {
  return (
    <div className="cover" role="img" aria-label="Book: 99 Names, Know Him, Call on Him. By Tadabbur Studio.">
      <Crescent size={32} />
      <div className="cover-mid" aria-hidden="true">
        <span className="n">99</span>
        <span className="t">Names</span>
        <span className="t" style={{ fontSize: "1.125rem", fontStyle: "normal", opacity: 0.85 }}>
          Know Him, Call on Him
        </span>
      </div>
      <span className="cover-foot" aria-hidden="true">
        Tadabbur Studio
      </span>
    </div>
  );
}
