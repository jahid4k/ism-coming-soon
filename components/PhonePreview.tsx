/**
 * The "Today" screen, state 1 (after Fajr), drawn with the page's own tokens.
 * Static on purpose: it previews the app, it isn't the app.
 */
export function PhonePreview() {
  return (
    <div
      className="stage"
      role="img"
      aria-label="Preview of the Today screen: Ar-Razzāq, The Provider, name 17 of 99, with a Learn today's name button."
    >
      <svg
        className="arch"
        viewBox="0 0 380 600"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arch-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--arch-a)" }} />
            <stop offset="1" style={{ stopColor: "var(--arch-b)" }} />
          </linearGradient>
        </defs>
        <path
          d="M2 600 V250 C2 150 90 70 190 4 C290 70 378 150 378 250 V600"
          stroke="url(#arch-grad)"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M26 600 V256 C26 170 104 100 190 40 C276 100 354 170 354 256 V600"
          stroke="url(#arch-grad)"
          strokeWidth="1"
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="phone" aria-hidden="true">
        <div className="phone-top">
          <span>After Fajr</span>
          <span>17 of 99</span>
        </div>

        <div className="phone-name">
          <span className="ar" lang="ar" dir="rtl">
            <span className="draw">الرَّزَّاق</span>
          </span>
          <span className="latin">Ar-Razzāq</span>
          <span className="caption">The Provider</span>
        </div>

        <div className="orn">
          <i />
        </div>

        <div className="btn">Learn today's name</div>

        <div className="review">
          <strong>2 names to review</strong>
          <span className="caption">Al-Ghaffār · Al-Khāliq</span>
        </div>

        <div className="phone-nav">
          <span>Today</span>
          <span>Review</span>
          <span>The 99</span>
        </div>
      </div>
    </div>
  );
}
