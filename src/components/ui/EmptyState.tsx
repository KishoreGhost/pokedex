import { SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "Pokémon not found. Try searching for another Pokémon." }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] w-full col-span-full">
      <div className="bg-muted rounded-full p-4 mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg max-w-sm">{message}</p>
    </div>
  );
}
