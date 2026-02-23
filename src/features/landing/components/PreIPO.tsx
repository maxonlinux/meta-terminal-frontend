import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const MotionImage = motion(Image);
const ICONS = Array.from(
  { length: 15 },
  (_, index) => `/landing/asset-icons/${index + 1}.svg`,
);

function PreIPO() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="grid grid-cols-5 gap-6 min-w-[500px]" ref={ref}>
      {isInView &&
        ICONS.map((src, index) => (
          <MotionImage
            key={src}
            src={src}
            alt="asset-icon"
            width={64}
            height={64}
            className="size-full rounded-[20%]"
            initial={{
              opacity: 0,
              x: 10 + index * 10,
              y: 10 + index + 10,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
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
