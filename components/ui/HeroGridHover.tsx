"use client";

import { useMemo, useState } from "react";

const columns = 20;
const rows = 10;

export function HeroGridHover() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cells = useMemo(() => Array.from({ length: columns * rows }, (_, index) => index), []);

  return (
    <div
      className="hero-grid-hover absolute inset-0 z-0 grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
      aria-hidden="true"
    >
      {cells.map((index) => (
        <div
          key={index}
          className={`hero-grid-cell${activeIndex === index ? " is-active" : ""}`}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex((current) => (current === index ? null : current))}
        />
      ))}
    </div>
  );
}
