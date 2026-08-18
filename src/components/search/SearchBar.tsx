"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm flex items-center">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for any Pokémon..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 pr-10 bg-background/80 backdrop-blur-sm focus-visible:ring-primary shadow-sm"
        />
      </div>
    </div>
  );
}
