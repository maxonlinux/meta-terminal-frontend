import type { ComponentPropsWithoutRef } from "react";
import { useMemo } from "react";
import { cls } from "@/utils/general.utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const copies = useMemo(
    () => Array.from({ length: repeat }, (_, idx) => ({ key: `copy-${idx}` })),
    [repeat],
  );

  return (
    <div
      {...props}
      className={cls(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] gap-(--gap)",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {copies.map((copy) => (
        <div
          key={copy.key}
          className={cls("flex shrink-0 justify-around gap-(--gap)", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:paused": pauseOnHover,
            "direction-reverse": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
