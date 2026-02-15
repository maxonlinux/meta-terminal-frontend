import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cls } from "@/utils/general.utils";

function LoginButton({
  className = "text-sm font-semibold leading-6",
}: {
  className?: string;
}) {
  return (
    <Link href="/login" className={cls(className, "flex items-center gap-2")}>
      TRADE WITH US <ArrowRight size={16} />
    </Link>
  );
}

export default LoginButton;
