"use client";

import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

export function NavBlur({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-40 transition-all duration-200",
        scrolled && "border-b border-border bg-black/70 backdrop-blur-[20px]"
      )}
    >
      {children}
    </div>
  );
}
