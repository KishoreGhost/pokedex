import { PAGE_SIZE, POKEAPI_BASE_URL } from "@/constants/pokemon";
import { PokemonDetail, PokemonListItem } from "@/types/pokemon";

export function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export async function fetchPokemonList(limit = PAGE_SIZE, offset = 0): Promise<{ results: PokemonListItem[]; count: number }> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error("Failed to fetch Pokemon list");
  
  const data = await response.json();
  
  const basicDetails = await Promise.all(
    data.results.map((p: { name: string; url: string }) => fetchPokemonByName(p.name).catch(() => null))
  );

  return {
    results: basicDetails.filter(Boolean) as PokemonListItem[],
    count: data.count,
  };
}

export async function fetchPokemonByName(nameOrId: string | number): Promise<PokemonDetail> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error("Pokemon not found");
    throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
  }
  
  const data = await response.json();
  
  return {
    id: data.id,
    name: data.name,
    displayName: data.name,
    types: data.types.map((t: any) => ({
      name: t.type.name,
      color: "", 
    })),
    spriteUrl: data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "",
    isFavourited: false,
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((a: any) => ({
      name: a.ability.name,
      displayName: a.ability.name,
      isHidden: a.is_hidden,
    })),
    baseStats: {
      hp: data.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0,
      attack: data.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0,
      defense: data.stats.find((s: any) => s.stat.name === "defense")?.base_stat || 0,
      specialAttack: data.stats.find((s: any) => s.stat.name === "special-attack")?.base_stat || 0,
      specialDefense: data.stats.find((s: any) => s.stat.name === "special-defense")?.base_stat || 0,
      speed: data.stats.find((s: any) => s.stat.name === "speed")?.base_stat || 0,
    },
    moves: data.moves.slice(0, 20).map((m: any) => ({
      name: m.move.name,
      displayName: m.move.name,
    })),
    officialArtworkUrl: data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "",
  };
}

export async function fetchPokemonByType(type: string): Promise<PokemonListItem[]> {
  const response = await fetch(`${POKEAPI_BASE_URL}/type/${type}`);
  if (!response.ok) throw new Error(`Failed to fetch type: ${type}`);
  
  const data = await response.json();
  const urls = data.pokemon.map((p: any) => p.pokemon.url);
  const limitedUrls = urls.slice(0, 40);
  
  const basicDetails = await Promise.all(
    limitedUrls.map(async (url: string) => {
      const id = extractIdFromUrl(url);
      return fetchPokemonByName(id).catch(() => null);
    })
  );
  
  return basicDetails.filter(Boolean) as PokemonListItem[];
}
