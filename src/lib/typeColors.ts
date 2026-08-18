import { PokemonTypeName } from "@/constants/pokemon";

export const typeColors: Record<PokemonTypeName, string> = {
  normal: "#9CA3AF",
  fire: "#F97316",
  water: "#3B82F6",
  grass: "#22C55E",
  electric: "#EAB308",
  ice: "#67E8F9",
  fighting: "#DC2626",
  poison: "#A855F7",
  ground: "#D97706",
  flying: "#818CF8",
  psychic: "#EC4899",
  bug: "#84CC16",
  rock: "#78716C",
  ghost: "#7C3AED",
  dragon: "#6366F1",
  dark: "#374151",
  steel: "#94A3B8",
  fairy: "#F472B6",
};

export function getTypeColor(type: string): string {
  const normalizedType = type.toLowerCase() as PokemonTypeName;
  return typeColors[normalizedType] || typeColors.normal;
}

export function getTypeGradient(types: string[]): string {
  if (!types || types.length === 0) return getTypeColor("normal");
  if (types.length === 1) return getTypeColor(types[0]);
  return `linear-gradient(135deg, ${getTypeColor(types[0])} 0%, ${getTypeColor(types[1])} 100%)`;
}
