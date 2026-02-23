import { requestJson } from "@/api/http";
import type { AssetData } from "@/features/assets/types";

export async function fetchAssets(): Promise<AssetData[]> {
  const { res, body } = await requestJson<AssetData[]>("/proxy/core/assets", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function fetchAsset(symbol: string): Promise<AssetData | null> {
  const { res, body } = await requestJson<AssetData>(
    `/proxy/core/assets?symbol=${encodeURIComponent(symbol)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function searchAssets(query: string): Promise<AssetData[]> {
  if (!query.trim()) return [];
  const { res, body } = await requestJson<AssetData[]>(
    `/proxy/core/assets/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}
