import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tvwidgetsymbol } = await searchParams;

  if (!tvwidgetsymbol) redirect(`/trade`);

  if (tvwidgetsymbol.endsWith("USD")) {
    const asset = tvwidgetsymbol.replace("USD", "");
    const restoredSymbol = `${asset}_USD`;

    redirect(`/trade/SPOT/${restoredSymbol}`);
  }

  const symbol = tvwidgetsymbol.replace("/", "_");

  redirect(`/trade/SPOT/${symbol}`);
}
