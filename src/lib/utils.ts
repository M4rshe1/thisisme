import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanReadable(number: number, decimals: number = 0): string {
  const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = number / scale;

  return scaled.toFixed(decimals) + suffix;
}

export const ConvertBytes = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (!bytes) return "n/a";
  const i = parseInt(
    Math.floor(Math.log(bytes) / Math.log(1000)).toString(),
    10
  );
  return `${(bytes / Math.pow(1000, i)).toFixed(1)} ${sizes[i]}`;
};

export const ConvertNumber = (number: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "decimal",
    maximumFractionDigits: 2,
  }).format(number);
};

export const parseISO = (date: string, locale?: string): string => {
  const formatted = new Date(date);
  const language =
    locale === "de" ? "de-de" : locale === "ch" ? "de-ch" : "en-us";

  return `${formatted.toLocaleString(language, {
    month: "long",
  })} ${formatted.getUTCDate()}, ${formatted.getFullYear()}`;
};

// // @ts-expect-error
// export function stripTypenames(value: any): any {
//     if (Array.isArray(value)) {
//         return value.map(stripTypenames);
//     } else if (value !== null && typeof value === "object") {
//         const newObject: Record<string, any> = {};
//         for (const property in value) {
//             if (property !== "__typename") {
//                 newObject[property] = stripTypenames(value[property]);
//             }
//         }
//         return newObject;
//     } else {
//         return value;
//     }
// }

const idToRequestCount = new Map<string, number>();
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 60 * 1000, // 1 minute
  maxRequests: 1,
};

export const rateLimit = (ip: string) => {
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};

export const slugify = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};
