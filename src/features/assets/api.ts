import type { AssetData } from "./types";

export async function fetchAssets(): Promise<AssetData[]> {
  const res = await fetch("/proxy/core/assets");
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}

export async function fetchAsset(symbol: string): Promise<AssetData | null> {
  const res = await fetch(
    `/proxy/core/assets?symbol=${encodeURIComponent(symbol)}`,
  );
  if (!res.ok) return null;
  const body = await res.json();
  return Array.isArray(body) ? null : body;
}

export async function searchAssets(query: string): Promise<AssetData[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/proxy/core/assets/search?query=${encodeURIComponent(query)}`,
  );
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}
