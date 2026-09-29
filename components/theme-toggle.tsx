"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Subscribe to `dark` class changes on <html> so the icon stays in sync no
// matter what flips the class (this toggle, or the pre-paint layout script).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
// The server can't know the resolved theme; the pre-paint script sets it before
// hydration, and useSyncExternalStore reconciles on the client without warning.
const getServerSnapshot = () => false;

// Lightweight theme switch: toggles the `dark` class on <html> and persists the
// choice. The initial class is set pre-paint by a script in the root layout.
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-muted-foreground hover:text-primary"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
