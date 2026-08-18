"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { useIntroPlayed } from "@/hooks/useIntroPlayed";
import { Header } from "@/components/layout/Header";
import { AmbientBackground } from "@/components/ambient/AmbientBackground";
import { PokemonGrid } from "@/components/pokemon/PokemonGrid";
import { usePokemonList } from "@/hooks/usePokemonList";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { usePokemonByType } from "@/hooks/usePokemonByType";
import { useFavouritePokemon } from "@/hooks/useFavouritePokemon";
import { SearchBar } from "@/components/search/SearchBar";
import { TypeFilter } from "@/components/filters/TypeFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { hasPlayed, markPlayed } = useIntroPlayed();
  const [showIntro, setShowIntro] = useState(true);
  const [activeType, setActiveType] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { pokemon: listPokemon, isLoading: listLoading, error: listError, total: listTotal, loadPage } = usePokemonList();
  const { result: searchResult, isLoading: searchLoading, error: searchError, query, setQuery, setPage: setSearchPage, setPageSize: setSearchPageSize, pokemon: searchPokemon, total: searchTotal, clearSearch } = useFuzzySearch();
  const { pokemon: typePokemon, isLoading: typeLoading, error: typeError, total: typeTotal, fetchByType, clearType } = usePokemonByType();
  const { pokemon: favPokemon, isLoading: favLoading, error: favError, total: favTotal, fetchFavs, clearFavs } = useFavouritePokemon();

  useEffect(() => {
    if (hasPlayed === true) {
      setShowIntro(false);
    }
  }, [hasPlayed]);

  // Unified fetching
  useEffect(() => {
    if (query) {
      setSearchPage(page);
      setSearchPageSize(pageSize);
    } else if (activeType === "favourites") {
      fetchFavs(page, pageSize);
    } else if (activeType) {
      fetchByType(activeType, page, pageSize);
    } else {
      loadPage(page, pageSize);
    }
  }, [page, pageSize, query, activeType, fetchFavs, fetchByType, loadPage, setSearchPage, setSearchPageSize]);

  // Favourites reactivity
  useEffect(() => {
    const handleFavUpdate = () => {
      if (activeType === "favourites") {
        fetchFavs(page, pageSize);
      }
    };
    window.addEventListener("pokedex-favourites-updated", handleFavUpdate);
    return () => window.removeEventListener("pokedex-favourites-updated", handleFavUpdate);
  }, [activeType, fetchFavs, page, pageSize]);

  if (hasPlayed === null) return null;

  const isSearchActive = !!query;
  const isTypeActive = activeType !== null;
  
  let displayPokemon = listPokemon;
  let displayLoading = listLoading;
  let displayError = listError;
  let displayTotal = listTotal;
  
  if (isSearchActive) {
    displayPokemon = searchPokemon;
    displayLoading = searchLoading;
    displayError = searchError;
    displayTotal = searchTotal;
  } else if (activeType === "favourites") {
    displayPokemon = favPokemon;
    displayLoading = favLoading;
    displayError = favError;
    displayTotal = favTotal;
  } else if (isTypeActive) {
    displayPokemon = typePokemon;
    displayLoading = typeLoading;
    displayError = typeError;
    displayTotal = typeTotal;
  }

  const handleSearch = (q: string) => {
    if (q) {
      setActiveType(null);
      clearType();
    }
    setPage(1);
    setQuery(q);
  };

  const handleClearSearch = () => {
    clearSearch();
    setPage(1);
  };
  
  const handleSelectType = (type: string | null) => {
    clearSearch();
    setActiveType(type);
    setPage(1);
    if (!type) {
      clearType();
      clearFavs();
    }
  };

  const totalPages = Math.ceil(displayTotal / pageSize);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <AmbientBackground />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Explore Pokémon</h1>
              <p className="text-muted-foreground mt-1">Discover stats, types, and abilities.</p>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            </div>
          </div>
          
          <div className="pt-2">
            <TypeFilter 
              activeType={activeType} 
              onSelectType={handleSelectType} 
            />
          </div>
          
          {displayTotal === 0 && !displayLoading ? (
            <EmptyState message={activeType === "favourites" ? "No favourites yet! Click the heart icon on any Pokémon to add them here." : "Pokémon not found."} />
          ) : (
            <>
              <PokemonGrid 
                pokemon={displayPokemon}
                isLoading={displayLoading}
                error={displayError}
                onRetry={() => {
                  if (activeType === "favourites") fetchFavs(page, pageSize);
                  else if (activeType) fetchByType(activeType, page, pageSize);
                  else loadPage(page, pageSize);
                }}
              />
              
              {!displayLoading && displayTotal > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{Math.min((page - 1) * pageSize + 1, displayTotal)}</span> to <span className="font-medium text-foreground">{Math.min(page * pageSize, displayTotal)}</span> of <span className="font-medium text-foreground">{displayTotal}</span>
                    </p>
                    <Select value={pageSize.toString()} onValueChange={(val) => { setPageSize(Number(val)); setPage(1); }}>
                      <SelectTrigger className="w-[110px] h-8 text-sm">
                        <SelectValue placeholder="Page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Pagination className="w-auto mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                      
                      <PaginationItem className="hidden sm:inline-block">
                        <span className="text-sm px-4">
                          Page {page} of {totalPages}
                        </span>
                      </PaginationItem>
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showIntro && (
          <CinematicIntro onComplete={markPlayed} />
        )}
      </AnimatePresence>
    </div>
  );
}
