"use client";

import { useState, useEffect, useCallback } from "react";
import { Favourite } from "@/types/pokemon";

const FAVOURITES_KEY = "pokedex-favourites";
const FAVOURITES_EVENT = "pokedex-favourites-updated";

export function useFavourites() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_KEY);
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favourites", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    
    const handleStorageEvent = () => loadFromStorage();
    window.addEventListener(FAVOURITES_EVENT, handleStorageEvent);
    return () => window.removeEventListener(FAVOURITES_EVENT, handleStorageEvent);
  }, [loadFromStorage]);

  const addFavourite = useCallback((id: number, name: string) => {
    setFavourites((prev) => {
      if (prev.some((f) => f.id === id)) return prev;
      const newFavs = [...prev, { id, name }];
      try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(newFavs));
        window.dispatchEvent(new Event(FAVOURITES_EVENT));
      } catch (e) {
        console.error("Failed to save favourites", e);
      }
      return newFavs;
    });
  }, []);

  const removeFavourite = useCallback((id: number) => {
    setFavourites((prev) => {
      const newFavs = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(newFavs));
        window.dispatchEvent(new Event(FAVOURITES_EVENT));
      } catch (e) {
        console.error("Failed to save favourites", e);
      }
      return newFavs;
    });
  }, []);

  const toggleFavourite = useCallback((id: number, name: string) => {
    if (favourites.some((f) => f.id === id)) {
      removeFavourite(id);
    } else {
      addFavourite(id, name);
    }
  }, [favourites, addFavourite, removeFavourite]);

  const isFavourited = useCallback((id: number) => {
    return favourites.some((f) => f.id === id);
  }, [favourites]);

  return {
    favourites,
    isLoaded,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    isFavourited,
  };
}
