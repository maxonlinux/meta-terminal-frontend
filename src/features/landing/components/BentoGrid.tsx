import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cls } from "@/utils/general.utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cls(
        "grid w-full auto-rows-[32rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cls(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl pointer-events-none",
      "border border-border",
      className,
    )}
    {...props}
  >
    <div className="pointer-events-auto">{background}</div>
    <div className="z-20 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-300 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-300">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cls(
        "absolute z-20 bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Link
        href={href}
        className="flex items-center pointer-events-auto px-4 py-2 rounded-full bg-white/10 hover:bg-accent transition-colors"
      >
        {cta}
        <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
    <div className="absolute z-10 inset-0 transform-gpu transition-all duration-300 group-hover:backdrop-blur-sm bg-linear-to-t from-20% from-background to-transparent" />
  </div>
);

export { BentoCard, BentoGrid };
