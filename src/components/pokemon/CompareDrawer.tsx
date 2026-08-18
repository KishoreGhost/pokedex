"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Scale } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useComparison } from "@/hooks/useComparison";
import { Button } from "@/components/ui/button";

export function CompareDrawer() {
  const { selections, removeSelection, clearSelections, isLoaded } = useComparison();
  const router = useRouter();

  if (!isLoaded) return null;

  return (
    <AnimatePresence>
      {selections.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-md mx-auto bg-card border border-border shadow-2xl rounded-2xl p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex gap-4">
              {selections.map((pokemon) => (
                <div key={pokemon.id} className="relative group">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary">
                    <Image
                      src={pokemon.spriteUrl || "/placeholder-pokemon.svg"}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <button
                    onClick={() => removeSelection(pokemon.id)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Empty slot placeholder */}
              {selections.length < 2 && (
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground">
                  <span className="text-xs font-medium opacity-50">?</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelections}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
              <Button
                disabled={selections.length !== 2}
                onClick={() => router.push("/compare")}
                className="rounded-full shadow-lg"
              >
                <Scale className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
