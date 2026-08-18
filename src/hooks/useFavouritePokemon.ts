import { useState, useCallback } from "react";
import { useFavourites } from "@/hooks/useFavourites";
import { PokemonListItem } from "@/types/pokemon";
import { fetchPokemonByName } from "@/services/pokemonApi";

export function useFavouritePokemon() {
  const { favourites, isLoaded } = useFavourites();
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchFavs = useCallback(async (page: number, pageSize: number) => {
    if (!isLoaded || favourites.length === 0) {
      setPokemon([]);
      setTotal(0);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTotal(favourites.length);
    
    try {
      const slice = favourites.slice((page - 1) * pageSize, page * pageSize);
      const results = await Promise.all(
        slice.map((f) => fetchPokemonByName(f.name))
      );
      
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
      setError(err.message || "Failed to load favourites");
    } finally {
      setIsLoading(false);
    }
  }, [favourites, isLoaded]);

  const clearFavs = useCallback(() => {
    setPokemon([]);
    setError(null);
    setTotal(0);
  }, []);

  return { pokemon, isLoading, error, total, fetchFavs, clearFavs };
}
