import { useState, useCallback, useRef } from "react";
import { fetchPokemonByName } from "@/services/pokemonApi";
import { PokemonListItem } from "@/types/pokemon";

export function usePokemonByType() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  // Cache the raw list of names for a given type to avoid re-fetching the huge list
  const cachedTypeNames = useRef<{ [type: string]: string[] }>({});

  const fetchByType = useCallback(async (type: string, page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let names = cachedTypeNames.current[type];
      
      if (!names) {
        // Fetch raw list of pokemon for this type
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!res.ok) throw new Error("Type not found");
        const data = await res.json();
        names = data.pokemon.map((p: any) => p.pokemon.name);
        cachedTypeNames.current[type] = names;
      }
      
      setTotal(names!.length);
      
      const slice = names!.slice((page - 1) * pageSize, page * pageSize);
      const results = await Promise.all(slice.map(name => fetchPokemonByName(name)));
      
      const listItems: PokemonListItem[] = results.map(detail => ({
        id: detail.id,
        name: detail.name,
        url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
        spriteUrl: detail.spriteUrl || "",
        displayName: detail.displayName,
        types: detail.types
      }));
      
      setPokemon(listItems);
    } catch (err: any) {
      setError(err.message || `Failed to load ${type} Pokémon`);
      setPokemon([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearType = useCallback(() => {
    setPokemon([]);
    setError(null);
    setTotal(0);
  }, []);

  return { pokemon, isLoading, error, total, fetchByType, clearType };
}
