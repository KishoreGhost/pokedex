import { useState, useCallback } from "react";
import { fetchPokemonByName } from "@/services/pokemonApi";
import { PokemonListItem } from "@/types/pokemon";

export function usePokemonSearch() {
  const [result, setResult] = useState<PokemonListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);
      
      const data = await fetchPokemonByName(query.toLowerCase().trim());
      setResult(data);
    } catch (err: any) {
      if (err.message === "Pokemon not found") {
        setIsNotFound(true);
      } else {
        setError(err.message || "Failed to search Pokémon");
      }
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResult(null);
    setIsNotFound(false);
    setError(null);
  }, []);

  return {
    result,
    isLoading,
    error,
    isNotFound,
    search,
    clearSearch,
  };
}
