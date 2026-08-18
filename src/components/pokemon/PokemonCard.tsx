"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PokemonListItem } from "@/types/pokemon";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { zeroPadId, cn } from "@/lib/utils";
import { getTypeColor } from "@/lib/typeColors";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useFavourites } from "@/hooks/useFavourites";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isFavourited, toggleFavourite, isLoaded } = useFavourites();
  const primaryColor = getTypeColor(pokemon.types[0]?.name || "normal");
  
  const fav = isLoaded && isFavourited(pokemon.id);

  return (
    <Link href={`/pokemon/${pokemon.name}`} prefetch={false} className="block w-full">
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card 
          className="h-full overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 relative group flex flex-col"
          style={{ borderLeftColor: primaryColor, borderLeftWidth: '4px' }}
        >
          {/* Favourites button - top right */}
          <button 
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
            onClick={(e) => {
              e.preventDefault();
              toggleFavourite(pokemon.id, pokemon.name);
            }}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={fav ? { scale: [1, 1.2, 1] } : {}}
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-colors", 
                  fav ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-500"
                )} 
              />
            </motion.div>
          </button>

          <div className="relative w-full aspect-square bg-muted/20 p-6 flex items-center justify-center">
            {/* Background glow based on primary type */}
            <div 
              className="absolute inset-0 opacity-20 dark:opacity-10 transition-opacity duration-300 group-hover:opacity-30 dark:group-hover:opacity-20"
              style={{
                background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 70%)`
              }}
            />
            
            <Image
              src={imageError || !pokemon.spriteUrl ? "/placeholder-pokemon.svg" : pokemon.spriteUrl}
              alt={pokemon.displayName}
              fill
              className="object-contain p-6 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          </div>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold capitalize tracking-tight leading-tight mr-2">{pokemon.displayName}</h3>
              <span className="text-sm font-mono text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md">
                {zeroPadId(pokemon.id)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.name} type={t.name} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
