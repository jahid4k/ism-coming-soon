import { AtmosphereToggle } from "@/components/AtmosphereToggle";
import { Logo } from "@/components/Logo";
import { PhonePreview } from "@/components/PhonePreview";
import { WaitlistForm } from "@/components/WaitlistForm";
import { site } from "@/lib/site";

const day = [
  {
    when: "After Fajr",
    title: "Learn today's name",
    body: "Hear the Arabic, read what it means, and see one āyah and one dua.",
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
            <p className="pill">Coming soon</p>
            <h1 className="display">
              Know Allah by His names. <span className="soft">One a day.</span>
            </h1>
            <p className="lede">
              {site.name} is a free app that helps you memorize Allah's names, understand them, and
              live by them. About three minutes a day.
            </p>
            <WaitlistForm />
          </div>

          <PhonePreview />
        </main>
      </div>

      <section className="section" aria-labelledby="day-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="day-h" className="heading">
              A day with one name
            </h2>
            <p className="lede">Short enough to keep, because the habit matters more than the length.</p>
          </div>
          <ol className="steps">
            {day.map((s) => (
              <li key={s.when} className="step">
                <span className="when">{s.when}</span>
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
              No streaks, no points, no badges, no leaderboards. Names you've learned come back for
              review on a gentle schedule, so they stay with you.
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
          <p className="lede">Leave your email and we'll tell you the day it's out.</p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap caption">
          {site.name} · Coming soon · © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}
