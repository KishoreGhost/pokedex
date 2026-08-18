"use client";

import { useState, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

export function AmbientBackground() {
  const [init, setInit] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();

  const particleColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

  const options = useMemo(() => ({
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: particleColor },
      links: {
        color: particleColor,
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 40,
      },
      opacity: {
        value: { min: 0.1, max: 0.3 },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), [particleColor]);

  if (prefersReducedMotion || !init) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none hidden md:block">
      <Particles id="tsparticles" options={options as any} className="h-full w-full opacity-50" />
    </div>
  );
}
