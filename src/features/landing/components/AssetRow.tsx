import AssetImage from "@/components/common/AssetImage";
import type { AssetData } from "@/features/assets/types";
import { useRealTimeCandle } from "@/features/trading/hooks/useRealTimeCandle";
import { formatNumber } from "@/utils/format";

function PriceCell({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <td className={`text-right ${className}`}>
      <span>{formatNumber(value, { maxDecimals: 8 })}</span>
    </td>
  );
}

function AssetRow({ asset }: { asset: AssetData }) {
  const { candle } = useRealTimeCandle(asset.symbol, 86400);

  if (!candle) {
    return null;
  }

  const priceDelta = candle.close - candle.open;
  const percentageDelta = (priceDelta / candle.open) * 100;

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
          priceDelta >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {priceDelta >= 0 && "+"}
        {percentageDelta.toFixed(2)}%
      </td>
    </tr>
  );
}

export default AssetRow;
