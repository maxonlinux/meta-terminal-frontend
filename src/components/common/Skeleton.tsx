// components/ui/skeleton.tsx

import type React from "react";
import { cls } from "@/utils/general.utils";

type SkeletonProps = {
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const baseStyles = "bg-neutral-900 animate-pulse";

  return <div className={cls(baseStyles, className)} />;
};
