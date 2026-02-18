"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    const res = await fetch("/proxy/main/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    toast.dismiss(toastId);

    if (!res.ok) {
      toast.error("Logout failed");
      return;
    }

    router.refresh();
  };

  return (
    <Button
      intent="outline"
      onClick={handleLogout}
      className="w-full bg-bg/30 justify-between cursor-pointer hover:scale-105 transition-transform"
    >
      Logout <ArrowRight data-slot="icon" size={16} />
    </Button>
  );
}
