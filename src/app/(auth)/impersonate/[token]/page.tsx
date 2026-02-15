import { Impersonate } from "@/features/auth/components/Impersonate";

export default async function ImpersonatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <Impersonate token={token} />;
}
