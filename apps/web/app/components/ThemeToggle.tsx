"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@pkg/ui-web";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        disabled
        size="icon"
        className="fixed top-4 right-4 bg-muted"
      >
        <span className="w-5 h-5 block">🌓</span>
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 bg-muted hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <span className="text-xl block p-1">{theme === "dark" ? "☀️" : "🌙"}</span>
    </Button>
  );
}

