/**
 * The "Today" screen after Fajr in the V3 Sky look: a small sky panel with gold Arabic.
 * Static on purpose: it previews the app, it isn't the app.
 */
export function PhonePreview() {
  return (
    <div
      className="stage"
      role="img"
      aria-label="Preview of the Today screen: Ar-Razzāq, The Provider, name 17 of 99, with a Learn today's name button."
    >
      <div className="phone" aria-hidden="true">
        <div className="phone-top">
          <span>After Fajr</span>
          <span>17 of 99</span>
        </div>

        <div className="sky-card">
          <span className="ar" lang="ar" dir="rtl">
            <span className="draw">الرَّزَّاق</span>
          </span>
          <span className="latin">Ar-Razzāq</span>
          <span className="meaning">The Provider</span>
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
