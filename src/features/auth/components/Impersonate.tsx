"use client";

import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const impersonate = async (token: string) => {
  const res = await fetch(`/auth/impersonate/${token}`, {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) redirect("/settings");

  const body = await res.json();
  toast.error(body.error);
  redirect("/login");
};

export const Impersonate = ({ token }: { token: string }) => {
  useEffect(() => {
    impersonate(token);
  }, [token]);

  return (
    <div className="flex items-center justify-center w-full">
      <Loader />
    </div>
  );
};
