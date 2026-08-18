import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHeight(decimetres: number): string {
  const metres = decimetres / 10;
  return `${metres.toFixed(1)} m`;
}

export function formatWeight(hectograms: number): string {
  const kilograms = hectograms / 10;
  return `${kilograms.toFixed(1)} kg`;
}

export function zeroPadId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function capitalise(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
