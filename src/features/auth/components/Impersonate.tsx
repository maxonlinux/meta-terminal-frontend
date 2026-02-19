"use client";

import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { impersonate } from "@/api/auth";

const runImpersonate = async (token: string) => {
  const res = await impersonate(token);

  if (res.res.ok) redirect("/settings");

  toast.error(res.body?.error ?? "Impersonation failed");
  redirect("/login");
};

export const Impersonate = ({ token }: { token: string }) => {
  useEffect(() => {
    runImpersonate(token);
  }, [token]);

  return (
    <div className="flex items-center justify-center w-full">
      <Loader />
    </div>
  );
};
