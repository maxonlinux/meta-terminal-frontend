import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const iconIds = Array.from({ length: 15 }, (_, i) => i + 1);

function PreIPO() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="grid grid-cols-5 gap-6 min-w-125" ref={ref}>
      {isInView &&
        iconIds.map((id, i) => (
          <motion.div
            key={id}
            className="relative size-full rounded-[20%]"
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
          >
            <Image
              src={`/landing/asset-icons/${id}.svg`}
              alt="asset-icon"
              fill
              className="rounded-[20%] object-contain"
              sizes="100px"
            />
          </motion.div>
        ))}
    </div>
  );
}

export default PreIPO;
