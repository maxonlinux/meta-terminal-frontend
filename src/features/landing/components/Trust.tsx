import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

function Counter({
  from,
  to,
  duration,
  className,
}: {
  from: number;
  to: number;
  duration: number;
  className?: string;
}) {
  const nodeRef = useRef<HTMLParagraphElement | null>(null);
  const isInView = useInView(nodeRef, { once: false });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        if (nodeRef.current) {
          const fixed = +value.toFixed();

          nodeRef.current.textContent = fixed.toLocaleString();
        }
      },
    });

    return () => controls.stop();
  }, [from, to, duration, isInView]);

  return <span className={className} ref={nodeRef} />;
}

const Trust = () => {
  return (
    <div className="flex flex-col justify-center gap-10 max-sm:gap-4 my-32">
      <h3 className="text-6xl max-sm:text-[8vw] font-bold text-center">
        We are trusted by
      </h3>
      <div className="text-7xl max-sm:text-[8vw] font-extrabold text-center text-gradient-animated bg-linear-to-r from-accent via-green-400 to-accent">
        <Counter from={0} to={200000} duration={2} />+
      </div>
      <h3 className="text-4xl max-sm:text-[5vw] font-bold text-center">
        users worldwide
      </h3>
    </div>
  );
};

export default Trust;
