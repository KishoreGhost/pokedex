"use client";

import { motion } from "framer-motion";
import { MAX_STAT } from "@/constants/pokemon";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

export function StatBar({ label, value, color }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / MAX_STAT) * 100));

  return (
    <div className="flex items-center gap-4 text-sm w-full">
      <div className="w-16 font-medium text-muted-foreground uppercase">{label}</div>
      <div className="w-8 text-right font-mono font-medium">{value}</div>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}
