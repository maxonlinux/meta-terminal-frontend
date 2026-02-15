import { useAssets } from "@/features/assets/hooks/useAssets";
import AssetRow from "./AssetRow";

function AssetsTable() {
  const { assets, isLoading } = useAssets();

  return (
    <table className="relative text-xs md:text-base lg:text-xl font-light border-separate border-spacing-y-2 w-full">
      <thead>
        <tr className="[&>th]:px-2 md:[&>th]:px-4 whitespace-nowrap [&>th]:py-2 [&>th]:border-b [&>th]:border-border [&>th]:font-normal opacity-50">
          <th className="text-left">Asset</th>
          <th>Price</th>
          <th className="max-sm:hidden">High</th>
          <th className="max-sm:hidden">Low</th>
          <th className="text-right">Change 24h</th>
        </tr>
      </thead>
      <tbody>
        {assets?.map((asset) => (
          <AssetRow key={asset.symbol} asset={asset} />
        ))}
        {isLoading && (
          <tr>
            <td colSpan={100}>
              <div className="flex justify-center w-full py-16">
                <div className="w-16 h-16 rounded-full border-4 opacity-70 border-light-100 border-r-light-100/50 animate-spin" />
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default AssetsTable;
