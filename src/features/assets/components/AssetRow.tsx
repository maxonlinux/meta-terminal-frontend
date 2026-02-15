"use client";

import Link from "next/link";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import AssetImage from "@/components/common/AssetImage";
import { useAsset } from "@/features/assets/hooks/useAsset";
import { usePosition } from "@/features/trading/hooks/usePosition";
import { useRealTimePrice } from "@/features/trading/hooks/useRealTimePrice";
import { useUnrealizedPnl } from "@/features/trading/hooks/useUnrealizedPnl";
import type { UserBalance } from "@/features/user/types";
import { formatNumber, formatUsd } from "@/utils/format";
import { cls } from "@/utils/general.utils";

export function AssetRow(props: {
  balance: UserBalance;
  symbol: string;
  onPriceUpdate: Dispatch<SetStateAction<Record<string, number>>>;
  onPnlUpdate: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const base = props.balance.currency;
  const symbol = props.symbol;

  const { asset } = useAsset(symbol);
  const { price } = useRealTimePrice(symbol);
  const { position } = usePosition({
    symbol: props.symbol,
    enabled: true,
  });

  const unrealizedPnl = useUnrealizedPnl(position);

  useEffect(() => {
    if (unrealizedPnl) {
      props.onPnlUpdate((prev) => ({
        ...prev,
        [symbol]: unrealizedPnl.toNumber(),
      }));
    }
  }, [unrealizedPnl, props.onPnlUpdate, symbol]);

  useEffect(() => {
    if (price) {
      props.onPriceUpdate((prev) => ({
        ...prev,
        [symbol]: price,
      }));
    }
  }, [price, symbol, props.onPriceUpdate]);

  const available = Number(props.balance.free);
  const reserved = Number(props.balance.locked);

  const valueUsd = price ? available * price : 0;
  const equityUsd = unrealizedPnl
    ? unrealizedPnl.toNumber() + valueUsd
    : valueUsd;
  const approxUsdText = price ? `≈${formatUsd(equityUsd)} USD` : "≈-- USD";
  const availableText = `${formatNumber(available)} ${base}`;
  const reservedText = `${formatNumber(reserved)} ${base}`;

  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="pl-4 pr-1">
        <div className="flex items-center gap-3">
          <AssetImage
            size={32}
            symbol={asset?.symbol ?? base}
            imageUrl={asset?.image_url}
          />
          <div className="flex flex-col">
            <div className="font-semibold text-white/90">{base}</div>
            <div className="text-white/50 text-xxs">{asset?.description}</div>
          </div>
        </div>
      </td>

      <td className="px-1 text-right">
        <div className="font-semibold text-white/90">{availableText}</div>
        <div className="text-white/50 text-xxs">{approxUsdText}</div>
      </td>

      <td className="px-1 text-right @max-sm:hidden">
        <div className="text-white/80">{availableText}</div>
        <div className="text-white/50 text-xxs">Locked {reservedText}</div>
      </td>

      <td className="pl-1 pr-4 text-right">
        <Link
          href={`/trade/SPOT/${symbol}`}
          className={cls(
            "inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-xs font-semibold",
            "text-accent hover:underline underline-offset-2",
          )}
        >
          Trade
        </Link>
      </td>
    </tr>
  );
}
