"use client";

import { useId, useState, type FormEvent } from "react";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; download: string; emailed: boolean }
  | { kind: "error"; message: string };

export function WaitlistForm() {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState({ kind: "loading" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website") }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        download?: string;
        emailed?: boolean;
      } | null;

      if (res.ok && json?.ok) {
        setState({ kind: "done", download: json.download ?? "", emailed: Boolean(json.emailed) });
        return;
      }

      if (json?.error === "invalid_email") {
        setState({ kind: "error", message: "That email doesn't look right. Check it and try again." });
      } else if (res.status === 429) {
        setState({ kind: "error", message: "Too many tries from this network. Please try again later." });
      } else {
        setState({ kind: "error", message: "Something went wrong on our side. Please try again in a minute." });
      }
    } catch {
      setState({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="signup">
        <div className="done" role="status">
          <h3>You're on the list.</h3>
          {state.download ? (
            <>
              <p>Your free book is ready.</p>
              <a className="btn" href={state.download} target="_blank" rel="noopener noreferrer">
                Download the book
              </a>
              <p className="caption">
                {state.emailed
                  ? "We've also emailed you the link, so you can open it again later. Check spam if you don't see it."
                  : "Save the file somewhere safe. We'll email you the day the app is out."}
              </p>
            </>
          ) : (
            <p className="caption">We'll email you the day the app is out.</p>
          )}
        </div>
      </div>
    );
  }

  const loading = state.kind === "loading";

  return (
    <form className="signup" onSubmit={onSubmit}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="field">
        <input
          id={`${id}-email`}
          className="input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          required
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Adding you…" : "Send me the free book"}
        </button>
      </div>
      <input
        className="hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <p className="status caption" role="status" data-kind={state.kind === "error" ? "error" : undefined}>
        {state.kind === "error"
          ? state.message
          : "Get the book now, and we'll tell you the day the app is out. Unsubscribe any time."}
      </p>
    </form>
  );
}
