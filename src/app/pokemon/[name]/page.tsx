"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { PokemonDetail, SkeletonDetail } from "@/components/pokemon/PokemonDetail";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/layout/Header";

// This is the App Router way to access dynamic params in a client component in React 19 / Next.js 15+
export default function PokemonDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const { pokemon, isLoading, error, isNotFound } = usePokemonDetail(resolvedParams.name);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-5xl mx-auto mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Pokédex
          </Link>
        </div>

        {isLoading ? (
          <SkeletonDetail />
        ) : isNotFound ? (
          <EmptyState message="Pokémon not found. It might not exist in the Pokédex yet." />
        ) : error ? (
          <ErrorState message={error} />
        ) : pokemon ? (
          <PokemonDetail pokemon={pokemon} />
        ) : null}
      </main>
    </div>
  );
}
