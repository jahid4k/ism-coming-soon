import { AtmosphereToggle } from "@/components/AtmosphereToggle";
import { BookCover } from "@/components/BookCover";
import { Logo } from "@/components/Logo";
import { PhonePreview } from "@/components/PhonePreview";
import { WaitlistForm } from "@/components/WaitlistForm";
import { site } from "@/lib/site";

const inside = [
  {
    title: "All 99 Names, one to a page",
    body: "Each Name in Arabic, with its meaning.",
  },
  {
    title: "A short description of each",
    body: "What the Name tells us about Allah, and where it appears.",
  },
  {
    title: "A du'a for every Name",
    body: "So you can call on Him by it.",
  },
  {
    title: "In English and Bengali",
    body: "Read it in whichever language reaches your heart.",
  },
];

const day = [
  {
    when: "After Fajr",
    title: "Learn today's name",
    body: "Hear the Arabic, read what it means, and see one āyah and one du'a.",
  },
  {
    when: "During the day",
    title: "Do one small thing",
    body: "Every name comes with one action to try. For Ar-Razzāq, it's giving a small sadaqah.",
  },
  {
    when: "After Isha",
    title: "Check in",
    body: "Ten seconds. Did you do it? Yes, or not today. Add a private note if you like.",
  },
];

export default function Home() {
  return (
    <>
      <div className="hero">
        <header className="wrap top">
          <Logo />
          <AtmosphereToggle />
        </header>

        <main className="wrap hero-grid">
          <div className="hero-copy">
            <p className="pill">Tadabbur Studio · App coming soon</p>
            <h1 className="display">
              Learn Allah's 99 names, <span className="soft">one a day.</span>
            </h1>
            <p className="lede">
              About three minutes each morning: one name, what it means, and one small way to live by it.
              The app isn't ready yet. Join the list and take the book of all 99 Names while you wait.
            </p>
            <WaitlistForm />
          </div>

          <PhonePreview />
        </main>
      </div>

      <section className="section" aria-labelledby="book-h">
        <div className="wrap book-grid">
          <div className="book-copy">
            <p className="lab">Free while you wait</p>
            <h2 id="book-h" className="heading">
              Know Him, call on Him: a book of all 99 Names
            </h2>
            <p className="lede">
              Start with the Names today. When the app arrives, you'll already know where you're going.
            </p>
            <ul className="inside">
              {inside.map((i) => (
                <li key={i.title}>
                  <strong>{i.title}</strong>
                  <span className="caption">{i.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <BookCover />
        </div>
      </section>

      <section className="section" aria-labelledby="day-h">
        <div className="wrap">
          <div className="section-head">
            <p className="lab">The app</p>
            <h2 id="day-h" className="heading">
              A day with one name
            </h2>
            <p className="lede">Short enough to keep, because the habit matters more than the length.</p>
          </div>
          <ol className="steps">
            {day.map((s) => (
              <li key={s.when} className="step">
                <span className="lab">{s.when}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="calm-h">
        <div className="wrap calm-grid">
          <h2 id="calm-h" className="heading">
            Worship is private. So is your progress.
          </h2>
          <div className="calm-copy">
            <p>
              No streaks, no points, no badges, no leaderboards. Names you've learned come back for review
              on a gentle schedule, so they stay with you.
            </p>
            <p className="caption">Your progress is shown as a quiet "17 of 99". Nothing more.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="close-h">
        <div className="wrap closing">
          <h2 id="close-h" className="heading">
            It's almost ready.
          </h2>
          <p className="lede">Leave your email, take the book, and we'll tell you the day the app is out.</p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap caption">
          <span>
            {site.name} · © {new Date().getFullYear()}
          </span>
          <a href={site.youtube} rel="noopener">
            YouTube
          </a>
        </div>
      </footer>
    </>
  );
}
