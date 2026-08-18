"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { useComparison } from "@/hooks/useComparison";
import { fetchPokemonByName } from "@/services/pokemonApi";
import { PokemonDetail as PokemonDetailType } from "@/types/pokemon";
import { Header } from "@/components/layout/Header";
import { SkeletonDetail } from "@/components/pokemon/PokemonDetail";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatBar } from "@/components/pokemon/StatBar";
import { getTypeColor } from "@/lib/typeColors";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ComparePage() {
  const { selections, isLoaded, removeSelection } = useComparison();
  const [details, setDetails] = useState<PokemonDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (selections.length < 2) {
      setIsLoading(false);
      return;
    }

    async function fetchCompareData() {
      setIsLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          selections.map((s) => fetchPokemonByName(s.name))
        );
        setDetails(results);
      } catch (err: any) {
        setError(err.message || "Failed to load comparison data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompareData();
  }, [selections, isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
          <div className="flex gap-8">
            <div className="flex-1"><SkeletonDetail /></div>
            <div className="flex-1"><SkeletonDetail /></div>
          </div>
        </main>
      </div>
    );
  }

  if (selections.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8 flex flex-col items-center justify-center">
          <EmptyState message="You need to select exactly 2 Pokémon to compare." />
          <Link href="/" className="mt-4 text-primary hover:underline">
            Go back to Pokédex
          </Link>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
          <ErrorState message={error} />
        </main>
      </div>
    );
  }

  const [p1, p2] = details;
  const p1Color = getTypeColor(p1.types[0]?.name || "normal");
  const p2Color = getTypeColor(p2.types[0]?.name || "normal");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Pokédex
          </Link>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6" /> Compare
          </h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Pokemon 1 */}
          <div className="flex flex-col gap-6 animate-in slide-in-from-left-8 duration-500">
            <div className="text-center relative">
              <button 
                className="absolute top-0 right-0 text-muted-foreground hover:text-destructive text-sm underline"
                onClick={() => removeSelection(p1.id)}
              >
                Remove
              </button>
              <div 
                className="w-48 h-48 mx-auto relative mb-4 rounded-full bg-muted/20 flex items-center justify-center p-4 border-2 shadow-xl"
                style={{ borderColor: p1Color }}
              >
                <Image
                  src={p1.officialArtworkUrl || p1.spriteUrl || "/placeholder-pokemon.svg"}
                  alt={p1.displayName}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <h2 className="text-3xl font-bold capitalize">{p1.displayName}</h2>
            </div>
            
            <Card className="p-6 border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1 opacity-20" style={{ backgroundColor: p1Color }} />
              <h3 className="text-xl font-bold mb-6">Base Stats</h3>
              <div className="space-y-4">
                <StatBar label="HP" value={p1.baseStats.hp} color={p1Color} />
                <StatBar label="ATK" value={p1.baseStats.attack} color={p1Color} />
                <StatBar label="DEF" value={p1.baseStats.defense} color={p1Color} />
                <StatBar label="SPA" value={p1.baseStats.specialAttack} color={p1Color} />
                <StatBar label="SPD" value={p1.baseStats.specialDefense} color={p1Color} />
                <StatBar label="SPE" value={p1.baseStats.speed} color={p1Color} />
              </div>
            </Card>
          </div>

          {/* Pokemon 2 */}
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center relative">
              <button 
                className="absolute top-0 right-0 text-muted-foreground hover:text-destructive text-sm underline"
                onClick={() => removeSelection(p2.id)}
              >
                Remove
              </button>
              <div 
                className="w-48 h-48 mx-auto relative mb-4 rounded-full bg-muted/20 flex items-center justify-center p-4 border-2 shadow-xl"
                style={{ borderColor: p2Color }}
              >
                <Image
                  src={p2.officialArtworkUrl || p2.spriteUrl || "/placeholder-pokemon.svg"}
                  alt={p2.displayName}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <h2 className="text-3xl font-bold capitalize">{p2.displayName}</h2>
            </div>
            
            <Card className="p-6 border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 bottom-0 right-0 w-1 opacity-20" style={{ backgroundColor: p2Color }} />
              <h3 className="text-xl font-bold mb-6">Base Stats</h3>
              <div className="space-y-4">
                <StatBar label="HP" value={p2.baseStats.hp} color={p2Color} />
                <StatBar label="ATK" value={p2.baseStats.attack} color={p2Color} />
                <StatBar label="DEF" value={p2.baseStats.defense} color={p2Color} />
                <StatBar label="SPA" value={p2.baseStats.specialAttack} color={p2Color} />
                <StatBar label="SPD" value={p2.baseStats.specialDefense} color={p2Color} />
                <StatBar label="SPE" value={p2.baseStats.speed} color={p2Color} />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
