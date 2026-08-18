export interface PokemonListItem {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  spriteUrl: string;
  isFavourited?: boolean;
}

export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonDetail extends PokemonListItem {
  height: number;
  weight: number;
  abilities: Ability[];
  baseStats: BaseStats;
  moves: Move[];
  officialArtworkUrl: string;
}

export interface Ability {
  name: string;
  displayName: string;
  isHidden: boolean;
}

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Move {
  name: string;
  displayName: string;
}

export interface TypePokemonList {
  typeName: string;
  pokemon: Array<{
    name: string;
    url: string;
  }>;
}

export interface Favourite {
  id: number;
  name: string;
  savedAt?: number;
}

export interface CompareSelection {
  slots: [PokemonDetail | null, PokemonDetail | null];
  isActive: boolean;
}
