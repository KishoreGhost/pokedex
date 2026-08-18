import { PokemonListItem } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { PAGE_SIZE } from "@/constants/pokemon";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function PokemonGrid({ pokemon, isLoading, error, onRetry }: PokemonGridProps) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!isLoading && pokemon.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
        
        {isLoading && (
          <>
            {Array.from({ length: pokemon.length === 0 ? PAGE_SIZE : 4 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
