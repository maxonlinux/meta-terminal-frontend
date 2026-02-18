import { useInView, motion } from "motion/react";
import { useRef } from "react";

function PreIPO() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="grid grid-cols-5 gap-6 min-w-[500px]" ref={ref}>
      {isInView &&
        Array.from({ length: 15 }).map((_, i) => (
          <motion.img
            key={i}
            src={`/landing/asset-icons/${i + 1}.svg`}
            alt="asset-icon"
            className="size-full rounded-[20%]"
            initial={{
              opacity: 0,
              x: 10 + i * 10,
              y: 10 + i + 10,
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
          />
        ))}
    </div>
  );
}

export default PreIPO;
