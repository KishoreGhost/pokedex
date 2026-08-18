"use client";

import { useState, useEffect, useCallback } from "react";
import { PokemonDetail } from "@/types/pokemon";

const COMPARE_KEY = "pokedex-compare";

export function useComparison() {
  const [selections, setSelections] = useState<PokemonDetail[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) {
        setSelections(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load compare selections", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addSelection = useCallback((pokemon: PokemonDetail) => {
    setSelections((prev) => {
      if (prev.length >= 2) return prev; // max 2
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      const newSel = [...prev, pokemon];
      try {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(newSel));
      } catch (e) {
        console.error("Failed to save comparison", e);
      }
      return newSel;
    });
  }, []);

  const removeSelection = useCallback((id: number) => {
    setSelections((prev) => {
      const newSel = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(newSel));
      } catch (e) {
        console.error("Failed to save comparison", e);
      }
      return newSel;
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelections([]);
    try {
      localStorage.removeItem(COMPARE_KEY);
    } catch (e) {
      console.error("Failed to clear comparison", e);
    }
  }, []);

  const isSelected = useCallback((id: number) => {
    return selections.some((p) => p.id === id);
  }, [selections]);

  const toggleSelection = useCallback((pokemon: PokemonDetail) => {
    if (isSelected(pokemon.id)) {
      removeSelection(pokemon.id);
    } else {
      addSelection(pokemon);
    }
  }, [isSelected, removeSelection, addSelection]);

  return {
    selections,
    isLoaded,
    addSelection,
    removeSelection,
    clearSelections,
    toggleSelection,
    isSelected,
    canAdd: selections.length < 2
  };
}
