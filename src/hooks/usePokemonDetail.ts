import { useState, useEffect } from "react";
import { fetchPokemonByName } from "@/services/pokemonApi";
import { PokemonDetail } from "@/types/pokemon";

export function usePokemonDetail(name: string) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchDetail() {
      try {
        setIsLoading(true);
        setError(null);
        setIsNotFound(false);
        
        const data = await fetchPokemonByName(name);
        
        if (isMounted) {
          setPokemon(data);
        }
      } catch (err: any) {
        if (isMounted) {
          if (err.message === "Pokemon not found") {
            setIsNotFound(true);
          } else {
            setError(err.message || "Failed to fetch Pokémon details");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchDetail();
    
    return () => {
      isMounted = false;
    };
  }, [name]);

  return { pokemon, isLoading, error, isNotFound };
}
