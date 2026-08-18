// T009 - App-wide constants

export const PAGE_SIZE = 20;
export const MAX_STAT = 255;
export const POKEAPI_BASE_URL =
  process.env.NEXT_PUBLIC_POKEAPI_BASE_URL ?? "https://pokeapi.co/api/v2";

export const TYPE_LIST = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonTypeName = (typeof TYPE_LIST)[number];

export const POKEMON_INTRO_SESSION_KEY = "pokedex-intro-played";
export const FAVOURITES_STORAGE_KEY = "pokedex-favourites";
