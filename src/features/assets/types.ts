export interface AssetData {
  symbol: string;
  exchange: string;
  description: string;
  tick_size: number | null;
  type: string;
  image_url?: string | null;
}

export interface UserFavouriteAsset {
  id: number;
  symbol: string;
  userId: number;
}

export interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: number;
}
