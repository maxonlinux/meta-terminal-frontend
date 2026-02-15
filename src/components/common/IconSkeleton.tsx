// components/ui/skeleton.tsx

import type React from "react";
import { cls } from "@/utils/general.utils";

type SkeletonProps = {
  className?: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const IconSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  icon: Icon,
}) => {
  const baseStyles = "text-neutral-900 animate-pulse";

  return <Icon className={cls(baseStyles, className)} />;
};
