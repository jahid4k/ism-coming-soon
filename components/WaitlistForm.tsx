"use client";

import { useId, useState, type FormEvent } from "react";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; status: "emailed" | "already"; download: string }
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
        status?: "emailed" | "already";
        download?: string;
      } | null;

      if (res.ok && json?.ok) {
        setState({
          kind: "done",
          status: json.status === "already" ? "already" : "emailed",
          download: json.download ?? "",
        });
        return;
      }

      if (json?.error === "invalid_email") {
        setState({ kind: "error", message: "That email doesn't look right. Check it and try again." });
      } else if (json?.error === "email_failed") {
        setState({
          kind: "error",
          message:
            "We couldn't send the email, so something is wrong on our side. Check the address and try again in a minute.",
        });
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
          <h3>{state.status === "already" ? "You're already on the list." : "You're on the list."}</h3>
          {state.download ? (
            <>
              <p>Your free book is ready.</p>
              <a className="btn" href={state.download} target="_blank" rel="noopener noreferrer">
                Download the book
              </a>
              <p className="caption">
                {state.status === "already"
                  ? "This address is already subscribed, so we haven't sent another email. We'll email you the day the app is out."
                  : "We've also sent you a welcome email. Check spam if you don't see it."}
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
