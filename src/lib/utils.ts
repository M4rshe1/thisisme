import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanReadable(number: number, decimals: number = 0): string {
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]
    const tier = Math.log10(Math.abs(number)) / 3 | 0

    const suffix = SI_SYMBOL[tier]
    const scale = Math.pow(10, tier * 3)

    const scaled = number / scale

    return scaled.toFixed(decimals) + suffix
}