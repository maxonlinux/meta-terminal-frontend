import { type MotionValue, useTransform } from "motion/react";

const useParallax = (value: MotionValue<number>, distance: number) =>
  useTransform(value, [0, 1], [0, distance]);

export default useParallax;
