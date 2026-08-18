"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 relative">
          <motion.div layoutId="brand-name" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">POKÉDEX</span>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
