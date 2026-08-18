"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPokemonByName } from "@/services/pokemonApi";
import { PokemonListItem } from "@/types/pokemon";

let globalNames: { name: string; url: string }[] | null = null;
let globalPromise: Promise<any> | null = null;

export function useFuzzySearch() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    if (!globalNames) return;
    if (!query) {
      setPokemon([]);
      setTotal(0);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Fuzzy match
    const matches = globalNames.filter(p => p.name.includes(query.toLowerCase()));
    setTotal(matches.length);
    
    // Paginate
    const slice = matches.slice((page - 1) * pageSize, page * pageSize);
    
    // Fetch details for the slice
    try {
      const results = await Promise.all(slice.map(p => fetchPokemonByName(p.name)));
      const listItems = results.map(detail => ({
        id: detail.id,
        name: detail.name,
        url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
        spriteUrl: detail.spriteUrl || "",
        displayName: detail.displayName,
        types: detail.types
      }));
      setPokemon(listItems);
    } catch (e: any) {
      setError(e.message || "Failed to search Pokémon");
    } finally {
      setIsLoading(false);
    }
  }, [query, page, pageSize]);

  useEffect(() => {
    if (!query) return;

    if (!globalNames) {
      setIsLoading(true);
      if (!globalPromise) {
        globalPromise = fetch("https://pokeapi.co/api/v2/pokemon?limit=10000").then(r => r.json());
      }
      globalPromise.then(d => {
        globalNames = d.results;
        performSearch();
      }).catch(e => {
        setError(e.message);
        setIsLoading(false);
      });
    } else {
      performSearch();
    }
  }, [query, page, pageSize, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setPokemon([]);
    setTotal(0);
  }, []);

  return { query, setQuery, setPage, setPageSize, pokemon, total, isLoading, error, clearSearch };
}
