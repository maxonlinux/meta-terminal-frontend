export interface AssetData {
  symbol: string;
  exchange: string;
  description: string;
  tick_size: number | null;
  type: string;
  image_url?: string | null;
}

export interface UserFavouriteAsset {
  id: string;
  symbol: string;
  userId: string;
}

export interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: number;
}
