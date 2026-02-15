import { type MotionValue, motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import type { RefObject } from "react";
import useParallax from "@/features/landing/hooks/useParallax";

const stocksMap = [
  { className: "", parallax: 0 },
  { className: "ml-[80px]", parallax: 0 },
  { className: "mt-[30px] -ml-[50px]", parallax: 1 },
  { className: "-mt-[150px] ml-[180px]", parallax: 0 },
  { className: "ml-[80px]", parallax: 0 },
  { className: "-ml-[20px]", parallax: 0 },
  { className: "ml-[70px]", parallax: 0 },
];

const cryptoMap = [
  { className: "mr-[100px]", parallax: 0 },
  { className: "mr-[200px]", parallax: 0 },
  { className: "-mt-[100px]", parallax: 0 },
  { className: "mr-[180px]", parallax: 0 },
  { className: "mr-[10px]", parallax: 1 },
  { className: "-mr-[50px]", parallax: 0 },
  { className: "", parallax: 0 },
];

const stockIcons = stocksMap.map((item, idx) => ({
  ...item,
  id: `stocks-${idx + 1}`,
  src: `/landing/parallax-icons/stocks/${idx + 1}.webp`,
}));

const cryptoIcons = cryptoMap.map((item, idx) => ({
  ...item,
  id: `crypto-${idx + 1}`,
  src: `/landing/parallax-icons/crypto/${idx + 1}.webp`,
}));

function ParallaxIcons({ scrollRef }: { scrollRef: RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });

  const springY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const parallaxMap = [
    useParallax(springY, -2000),
    useParallax(springY, -3000),
  ];

  const ParallaxCoin = ({
    y,
    className,
    src,
  }: {
    y: MotionValue;
    className: string;
    src: string;
  }) => (
    <motion.div style={{ y }} className={`relative w-fit ${className}`}>
      <Image src={src} alt="Parallax Icon" width={96} height={96} />
    </motion.div>
  );

  return (
    <div className="absolute flex top-0 h-full sm:-left-[40%] gap-[clamp(400px,60vw,600px)] sm:-right-[40%] justify-center z-20 mt-16 pointer-events-none max-sm:hidden">
      <div className="relative left-0 top-0 w-80 flex flex-col gap-10 items-start scale-75">
        {stockIcons.map((icon) => (
          <ParallaxCoin
            key={icon.id}
            y={parallaxMap[icon.parallax]}
            className={`${icon.className} brightness-150 contrast-150`}
            src={icon.src}
          />
        ))}
      </div>
      <div className="relative right-0 top-0 w-80 flex flex-col gap-10 items-end scale-75">
        {cryptoIcons.map((icon) => (
          <ParallaxCoin
            key={icon.id}
            y={parallaxMap[icon.parallax]}
            className={`${icon.className} brightness-150 contrast-150`}
            src={icon.src}
          />
        ))}
      </div>
    </div>
  );
}

export default ParallaxIcons;
