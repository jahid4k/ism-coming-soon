"use client";

import { useEffect, useState } from "react";

type Atmosphere = "dawn" | "night";

export function AtmosphereToggle() {
  const [current, setCurrent] = useState<Atmosphere | null>(null);

  useEffect(() => {
    const a = document.documentElement.getAttribute("data-atmosphere");
    setCurrent(a === "dawn" ? "dawn" : "night");
  }, []);

  function choose(a: Atmosphere) {
    document.documentElement.setAttribute("data-atmosphere", a);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", a === "dawn" ? "#F7F1EA" : "#0B1026");
    try {
      localStorage.setItem("atmosphere", a);
    } catch {}
    setCurrent(a);
  }

  return (
    <div className="seg" role="group" aria-label="Atmosphere">
      <button type="button" aria-pressed={current === "dawn"} onClick={() => choose("dawn")}>
        Dawn
      </button>
      <button type="button" aria-pressed={current === "night"} onClick={() => choose("night")}>
        Night
      </button>
    </div>
  );
}
