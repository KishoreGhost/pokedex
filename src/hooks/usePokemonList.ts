import { useState, useEffect, useCallback } from "react";
import { fetchPokemonList } from "@/services/pokemonApi";
import { PokemonListItem } from "@/types/pokemon";

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const offset = (page - 1) * pageSize;
      const data = await fetchPokemonList(pageSize, offset);
      setPokemon(data.results);
      if (data.count) setTotal(data.count);
    } catch (err: any) {
      setError(err.message || "Failed to load Pokémon");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pokemon,
    isLoading,
    error,
    total,
    loadPage,
  };
}
