export type TradingCategory = "SPOT" | "LINEAR";
export type TradingSide = "BUY" | "SELL";
export type TradingOrderType = "MARKET" | "LIMIT";
export type TradingTif = "IOC" | "GTC" | "FOK" | "POST_ONLY";
export type TradingOrderOrigin = "USER" | "SYSTEM";

export type TradingOrderStatus =
  | "NEW"
  | "PARTIALLY_FILLED"
  | "PARTIALLY_FILLED_CANCELED"
  | "FILLED"
  | "CANCELED"
  | "UNTRIGGERED"
  | "TRIGGERED"
  | "DEACTIVATED";

export type TradingStopOrderType =
  | "TakeProfit"
  | "StopLoss"
  | "TrailingStop"
  | "Stop";

export type TradingOpenOrder = {
  id: number;
  userId: number;
  symbol: string;
  category: TradingCategory;
  origin: TradingOrderOrigin;
  side: TradingSide;
  type: TradingOrderType;
  timeInForce: TradingTif;
  status: TradingOrderStatus;
  qty: string;
  filled: string;
  price: string;
  triggerPrice?: string;
  reduceOnly: boolean;
  closeOnTrigger: boolean;
  stopOrderType?: TradingStopOrderType;
  isConditional: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TradingPosition = {
  symbol: string;
  size: string;
  entryPrice: string;
  leverage: string;
  takeProfit: string;
  stopLoss: string;
  liqPrice: string;
};

export type TradingPnL = {
  id: number;
  orderId: number;
  symbol: string;
  category: TradingCategory;
  side: number;
  price: string;
  qty: string;
  realized: string;
  createdAt: number;
};

export type TradingHistoryOrder = TradingOpenOrder;

export type TradingFill = {
  id: number;
  userId: number;
  orderId: number;
  counterpartyOrderId: number;
  symbol: string;
  category: TradingCategory;
  side: TradingSide;
  role: string;
  price: string;
  qty: string;
  timestamp: number;
  orderType: TradingOrderType;
};

export type TradingInstrument = {
  symbol: string;
  base: string;
  quote: string;
  pricePrecision: number;
  quantityPrecision: number;
  tickSize: string;
  stepSize: string;
  minQty: string;
  minNotional: string;
};
