"use client";

import { useState, useEffect } from "react";
import { POKEMON_INTRO_SESSION_KEY } from "@/constants/pokemon";

export function useIntroPlayed() {
  const [hasPlayed, setHasPlayed] = useState<boolean | null>(null);

  useEffect(() => {
    // Always play on load for demo purposes
    setHasPlayed(false);
  }, []);

  const markPlayed = () => {
    setHasPlayed(true);
  };

  return { hasPlayed, markPlayed };
}
