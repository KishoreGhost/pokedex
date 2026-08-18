"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
}

const BRAND_TEXT = "POKÉDEX";

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
    }
  }, [prefersReducedMotion, onComplete]);

  if (prefersReducedMotion) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground text-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
    >
      <motion.div
        layoutId="brand-name"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={() => {
          setTimeout(onComplete, 800);
        }}
        className="flex space-x-2"
      >
        {BRAND_TEXT.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            className="text-6xl md:text-8xl font-black tracking-tighter"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
