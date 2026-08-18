"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TYPE_LIST } from "@/constants/pokemon";
import { getTypeColor } from "@/lib/typeColors";
import { cn, capitalise } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TypeFilterProps {
  activeType: string | null;
  onSelectType: (type: string | null) => void;
}

const QUICK_TYPES = ["fire", "water", "grass"];
const MORE_TYPES = TYPE_LIST.filter(t => !QUICK_TYPES.includes(t));

export function TypeFilter({ activeType, onSelectType }: TypeFilterProps) {
  const isMoreActive = activeType && activeType !== "favourites" && !QUICK_TYPES.includes(activeType);
  const moreActiveColor = isMoreActive ? getTypeColor(activeType) : undefined;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 px-1">
        <FilterChip
          label="All"
          isActive={activeType === null}
          onClick={() => onSelectType(null)}
          color="#a1a1aa"
        />
        <FilterChip
          label="❤️ Favourites"
          isActive={activeType === "favourites"}
          onClick={() => onSelectType("favourites")}
          color="#ef4444"
        />

        {QUICK_TYPES.map((type) => (
          <FilterChip
            key={type}
            label={capitalise(type)}
            isActive={activeType === type}
            onClick={() => onSelectType(type)}
            color={getTypeColor(type)}
          />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger className="p-0 border-0 bg-transparent cursor-pointer">
            <motion.div
              role="button"
              tabIndex={0}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-1.5 flex items-center gap-1 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer",
                isMoreActive ? "text-white border-transparent shadow-md" : "bg-transparent hover:bg-muted text-foreground"
              )}
              style={{
                backgroundColor: isMoreActive ? moreActiveColor : undefined,
                borderColor: isMoreActive ? moreActiveColor : undefined,
                color: isMoreActive ? "#fff" : undefined,
              }}
            >
              {isMoreActive ? capitalise(activeType) : "More Types"}
              <ChevronDown className="w-4 h-4 opacity-70" />
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-y-auto">
            {MORE_TYPES.map(type => (
              <DropdownMenuItem
                key={type}
                onClick={() => onSelectType(type)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getTypeColor(type) }}
                />
                {capitalise(type)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function FilterChip({ label, isActive, onClick, color }: { label: string, isActive: boolean, onClick: () => void, color: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
        isActive ? "text-white border-transparent shadow-md" : "bg-transparent hover:bg-muted text-foreground"
      )}
      style={{
        backgroundColor: isActive ? color : undefined,
        borderColor: isActive ? color : undefined,
        color: isActive ? "#fff" : undefined,
      }}
    >
      {label}
    </motion.button>
  );
}
