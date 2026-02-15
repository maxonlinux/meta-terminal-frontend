import TerminalView from "@/features/trading/views/TerminalView";

export const dynamic = "force-dynamic";

export default async function TradeTerminalPage({
  params,
}: {
  params: Promise<{ category: string; symbol: string }>;
}) {
  const p = await params;
  if (!p.symbol || !p.category) return null;
  return <TerminalView symbol={p.symbol} category={p.category} />;
}
