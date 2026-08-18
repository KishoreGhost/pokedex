"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Scale } from "lucide-react";
import { PokemonDetail as PokemonDetailType } from "@/types/pokemon";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "./StatBar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTypeColor, getTypeGradient } from "@/lib/typeColors";
import { zeroPadId, formatHeight, formatWeight, capitalise } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparison } from "@/hooks/useComparison";

interface PokemonDetailProps {
  pokemon: PokemonDetailType;
}

export function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const [imageError, setImageError] = useState(false);
  const { toggleSelection, isSelected, canAdd, isLoaded } = useComparison();

  const primaryColor = getTypeColor(pokemon.types[0]?.name || "normal");
  const gradient = getTypeGradient(pokemon.types.map(t => t.name));

  const selected = isLoaded && isSelected(pokemon.id);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Image & Core Info */}
      <div className="w-full md:w-5/12 flex flex-col gap-6">
        <div
          className="relative w-full aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-border/50 shadow-sm flex items-center justify-center p-8 group"
          style={{ background: `linear-gradient(135deg, ${primaryColor}20 0%, transparent 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-20 dark:opacity-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 70%)`
            }}
          />
          <Image
            src={imageError || !pokemon.officialArtworkUrl ? "/placeholder-pokemon.svg" : pokemon.officialArtworkUrl}
            alt={pokemon.displayName}
            fill
            className="object-contain p-8 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => setImageError(true)}
          />
          <button
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 transition-colors"
            onClick={() => console.log("Toggle fav")}
          >
            <Heart className="w-6 h-6 text-muted-foreground hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div>
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-end gap-3">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight capitalize">{pokemon.displayName}</h1>
              <span className="text-xl lg:text-2xl font-mono text-muted-foreground font-medium mb-1">
                {zeroPadId(pokemon.id)}
              </span>
            </div>

            <Button
              variant={selected ? "default" : "outline"}
              size="sm"
              className="hidden md:flex"
              onClick={() => toggleSelection(pokemon)}
              disabled={!selected && !canAdd}
            >
              <Scale className="w-4 h-4 mr-2" />
              {selected ? "Remove" : "Compare"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.name} type={t.name} className="text-base px-4 py-1" />
              ))}
            </div>

            <Button
              variant={selected ? "default" : "outline"}
              size="sm"
              className="md:hidden"
              onClick={() => toggleSelection(pokemon)}
              disabled={!selected && !canAdd}
            >
              <Scale className="w-4 h-4 mr-2" />
              {selected ? "Remove" : "Compare"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Stats, Details, Moves */}
      <div className="w-full md:w-7/12 flex flex-col gap-8">
        {/* Base Stats */}
        <Card className="p-6 border-border/50 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Base Stats
          </h3>
          <div className="space-y-4">
            <StatBar label="HP" value={pokemon.baseStats.hp} color={primaryColor} />
            <StatBar label="ATK" value={pokemon.baseStats.attack} color={primaryColor} />
            <StatBar label="DEF" value={pokemon.baseStats.defense} color={primaryColor} />
            <StatBar label="SPA" value={pokemon.baseStats.specialAttack} color={primaryColor} />
            <StatBar label="SPD" value={pokemon.baseStats.specialDefense} color={primaryColor} />
            <StatBar label="SPE" value={pokemon.baseStats.speed} color={primaryColor} />
          </div>
        </Card>

        {/* Physical Details & Abilities */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 border-border/50 shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Height</h4>
            <p className="text-2xl font-mono font-medium">{formatHeight(pokemon.height)}</p>
          </Card>
          <Card className="p-6 border-border/50 shadow-sm">
            <h4 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Weight</h4>
            <p className="text-2xl font-mono font-medium">{formatWeight(pokemon.weight)}</p>
          </Card>
        </div>

        <Card className="p-6 border-border/50 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Abilities</h3>
          <div className="flex flex-wrap gap-3">
            {pokemon.abilities.map((ability) => (
              <Badge
                key={ability.name}
                variant={ability.isHidden ? "outline" : "secondary"}
                className="text-sm px-3 py-1 font-medium capitalize"
              >
                {ability.displayName.replace("-", " ")}
                {ability.isHidden && <span className="ml-2 text-xs opacity-70">(Hidden)</span>}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Moves</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.moves.map((move) => (
              <Badge
                key={move.name}
                variant="outline"
                className="bg-muted/30 hover:bg-muted/50 text-xs px-2.5 py-1 capitalize border-border/50"
              >
                {move.displayName.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
      <div className="w-full md:w-5/12 flex flex-col gap-6">
        <Skeleton className="w-full aspect-square rounded-3xl" />
        <div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="w-full md:w-7/12 flex flex-col gap-8">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
