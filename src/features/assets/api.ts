import { core } from "@/api/client";
import type { AssetData } from "./types";

export async function fetchAssets(): Promise<AssetData[]> {
  const res = await core["/assets"].get();
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}

export async function fetchAsset(symbol: string): Promise<AssetData | null> {
  const res = await core["/assets"].get({ query: { symbol } });
  if (!res.ok) return null;
  const body = await res.json();
  return Array.isArray(body) ? null : body;
}

export async function searchAssets(query: string): Promise<AssetData[]> {
  if (!query.trim()) return [];
  const res = await core["/assets/search"].get({ query: { query } });
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}
