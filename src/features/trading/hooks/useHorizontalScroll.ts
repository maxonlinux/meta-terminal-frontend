import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const useHorizontalScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress, scrollX } = useScroll({
    container: scrollContainerRef,
  });

  const [showLeftScrollButton, setShowLeftScrollButton] = useState(false);
  const [showRightScrollButton, setShowRightScrollButton] = useState(false);

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    setShowRightScrollButton(latest < 1);
  });

  useMotionValueEvent(scrollX, "change", (latest) => {
    setShowLeftScrollButton(latest > 0);
  });

  const handleScrollClick = (direction: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 160;

    container.scrollBy({
      left: scrollAmount * direction,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowRightScrollButton(container.scrollWidth > container.clientWidth);
  }, []);

  return {
    scrollContainerRef,
    showLeftScrollButton,
    showRightScrollButton,
    handleScrollClick,
  };
};
