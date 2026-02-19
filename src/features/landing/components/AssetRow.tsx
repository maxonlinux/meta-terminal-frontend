import AssetImage from "@/components/common/AssetImage";
import type { AssetData } from "@/features/assets/types";
import { useRealTimeCandle } from "@/features/trading/hooks/useRealTimeCandle";
import Decimal from "decimal.js";

function PriceCell({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const text = new Decimal(value)
    .toDecimalPlaces(8, Decimal.ROUND_DOWN)
    .toString();
  return (
    <td className={`text-right ${className}`}>
      <span>{text}</span>
    </td>
  );
}

function AssetRow({ asset }: { asset: AssetData }) {
  const { candle } = useRealTimeCandle(asset.symbol, 86400);

  if (!candle) {
    return null;
  }

  const close = new Decimal(candle.close);
  const open = new Decimal(candle.open);
  const priceDelta = close.minus(open);
  const percentageDelta = open.isZero()
    ? new Decimal(0)
    : priceDelta.div(open).mul(100);
  const pctText = `${priceDelta.gt(0) ? "+" : ""}${percentageDelta
    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
    .toString()}%`;

  return (
    <tr
      key={asset.symbol}
      className="[&>td]:px-2 md:[&>td]:px-4 [&>td]:py-2 hover:bg-white/10 cursor-pointer"
      onClick={() => {
        window.location.href = "/register";
      }}
    >
      <td className="text-left rounded-l-lg max-lg:w-full">
        <div className="flex gap-4 items-center">
          <AssetImage
            imageUrl={asset.image_url}
            symbol={asset.symbol}
            size={32}
          />
          {asset.description}
        </div>
      </td>
      <PriceCell value={candle.close} />
      <PriceCell value={candle.high} className="max-sm:hidden" />
      <PriceCell value={candle.low} className="max-sm:hidden" />
      <td
        className={`rounded-r-lg text-right ${
          priceDelta.gte(0) ? "text-green-500" : "text-red-500"
        }`}
      >
        {pctText}
      </td>
    </tr>
  );
}

export default AssetRow;
