"use client";

import { useId, useState, type FormEvent } from "react";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done" }
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

      if (res.ok) {
        setState({ kind: "done" });
        return;
      }

      const json = (await res.json().catch(() => null)) as { error?: string } | null;
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
          <strong>You're on the list.</strong>
          <span className="caption">We'll email you the day 99 Names is out.</span>
        </div>
      </div>
    );
  }

  const loading = state.kind === "loading";

  return (
    <form className="signup" onSubmit={onSubmit} noValidate={false}>
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
          {loading ? "Adding you…" : "Notify me when it's out"}
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
      <p className="status" role="status" data-kind={state.kind === "error" ? "error" : undefined}>
        {state.kind === "error" ? (
          state.message
        ) : (
          <span className="caption">
            We'll only use your email to tell you when the app is ready. Unsubscribe any time.
          </span>
        )}
      </p>
    </form>
  );
}
