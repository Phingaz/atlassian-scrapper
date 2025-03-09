import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CONSTANTS = {
  LOCAL_STORAGE_KEY: "openCards",
  DATA: "data",
  ISPROD: process.env.NODE_ENV === "production",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const featureFlag = {
  rss: process.env.NEXT_PUBLIC_FEATURE_RSS,
};

export type FeatureFlagType = typeof featureFlag;
