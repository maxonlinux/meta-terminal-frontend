import { motion } from "motion/react";

const bg = "bg-neutral-900";

const Smartphone = () => (
  <div className="relative z-20 shrink-0 flex flex-col items-center h-[200] w-[100] rounded-2xl border overflow-hidden bg-background">
    <div className="absolute px-4 h-1.5 rounded-full border top-2 bg-background" />
    <div className="size-full flex flex-col gap-1 p-1.5 pt-6 pb-4">
      <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
      <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
      <div className="flex items-center justify-center w-full h-full border border-neutral-800 rounded-xs">
        <div className="flex gap-0.5">
          <div className="h-2.5 w-0.5 mt-1 bg-red-400" />
          <div className="h-4 w-0.5 mt-1.5 bg-accent" />
          <div className="h-2 w-0.5 bg-accent" />
          <div className="h-2 w-0.5 mt-1 bg-red-400" />
          <div className="h-2.5 w-0.5 mt-1 bg-accent" />
          <div className="h-2 w-0.5 bg-accent" />
          <div className="h-2 w-0.5 mt-2 bg-red-400" />
          <div className="h-2.5 w-0.5 mt-1 bg-accent" />
          <div className="h-2 w-0.5 mt-3 bg-red-400" />
          <div className="h-2 w-0.5 mt-4.5 bg-red-400" />
          <div className="h-3 w-0.5 mt-2 bg-accent" />
          <div className="h-2.5 w-0.5 mt-1 bg-accent" />
          <div className="h-2 w-0.5 bg-accent" />
        </div>
      </div>
      <div className={`w-full h-full ${bg} rounded-xs`} />
      <div className="flex gap-1 justify-between">
        <div className={`w-full h-3 ${bg} rounded-xs`} />
        <div className={`w-full h-3 ${bg} rounded-xs`} />
        <div className={`w-full h-3 ${bg} rounded-xs`} />
      </div>
    </div>
  </div>
);

const Tablet = () => (
  <div className="relative z-10 shrink-0 h-[300] w-[200] rounded-2xl border p-1 transition-transform bg-background max-lg:-translate-x-20">
    <div className="size-full rounded-xl border overflow-hidden">
      <div className="size-full flex flex-col gap-1 p-1.5 pt-4 pb-4">
        <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
        <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
        <div className="flex gap-1 h-full">
          <div className="flex items-center justify-center w-full h-full border border-neutral-800 rounded-xs">
            <div className="flex gap-0.5">
              <div className="h-2.5 w-0.5 mt-1 bg-red-400" />
              <div className="h-4 w-0.5 mt-1.5 bg-accent" />
              <div className="h-2 w-0.5 bg-accent" />
              <div className="h-2 w-0.5 mt-1 bg-red-400" />
              <div className="h-2.5 w-0.5 mt-1 bg-accent" />
              <div className="h-2 w-0.5 bg-accent" />
              <div className="h-2 w-0.5 mt-2 bg-red-400" />
              <div className="h-2.5 w-0.5 mt-1 bg-accent" />
              <div className="h-2 w-0.5 mt-3 bg-red-400" />
              <div className="h-2 w-0.5 mt-4.5 bg-red-400" />
              <div className="h-3 w-0.5 mt-2 bg-accent" />
              <div className="h-2.5 w-0.5 mt-1 bg-accent" />
              <div className="h-2 w-0.5 bg-accent" />
            </div>
          </div>
          <div className={`w-1/2 ${bg} rounded-xs`} />
        </div>
        <div className="flex gap-1 h-full">
          <div className={`w-1/2 h-full ${bg} rounded-xs`} />
          <div className={`w-full h-full ${bg} rounded-xs`} />
        </div>
        <div className="flex gap-1 justify-between">
          <div className={`w-full h-3 ${bg} rounded-xs`} />
          <div className={`w-full h-3 ${bg} rounded-xs`} />
          <div className={`w-full h-3 ${bg} rounded-xs`} />
          <div className={`w-full h-3 ${bg} rounded-xs`} />
        </div>
      </div>
    </div>
  </div>
);

const Desktop = () => (
  <div className="relative flex flex-col items-center transition-transform max-lg:-translate-x-40">
    <div className="h-[300] w-[500] rounded-lg border p-1 pb-8 bg-background">
      <div className="size-full rounded-sm border rounded-b-none">
        <div className="size-full flex flex-col gap-1 p-1.5 pt-4">
          <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
          <div className={`w-full h-3 shrink-0 ${bg} rounded-xs`} />
          <div className="flex gap-1 h-full">
            <div className={`w-1/2 ${bg} rounded-xs`} />
            <div className="relative flex items-center justify-center w-full h-full border border-neutral-800 rounded-xs">
              <div className="flex gap-0.5 scale-y-150">
                <div className="h-2 w-0.5 mt-1 bg-red-400" />
                <div className="h-3 w-0.5 mt-1.5 bg-accent" />
                <div className="h-2.5 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-red-400" />
                <div className="h-3 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-accent" />
                <div className="h-2.5 w-0.5 mt-2 bg-red-400" />
                <div className="h-3 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-3 bg-red-400" />
                <div className="h-2 w-0.5 mt-4 bg-red-400" />
                <div className="h-3 w-0.5 mt-2 bg-accent" />
                <div className="h-2.5 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-accent" />
                <div className="h-2 w-0.5 mt-1 bg-red-400" />
                <div className="h-2.5 w-0.5 mt-0.5 bg-accent" />
                <div className="h-3 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-red-400" />
                <div className="h-2.5 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-accent" />
                <div className="h-2 w-0.5 mt-2 bg-red-400" />
                <div className="h-2.5 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-3 bg-red-400" />
                <div className="h-2 w-0.5 mt-4 bg-red-400" />
                <div className="h-3 w-0.5 mt-2 bg-accent" />
                <div className="h-2.5 w-0.5 mt-1 bg-accent" />
                <div className="h-2 w-0.5 mt-0.5 bg-accent" />
                <div className="h-3 w-0.5 mt-1 bg-red-400" />
                <div className="h-2 w-0.5 mt-0.5 bg-accent" />
                <div className="h-2.5 w-0.5 mt-1 bg-red-400" />
              </div>
            </div>
            <div className={`w-1/2 h-full ${bg} rounded-xs`} />
            <div className={`w-1/2 h-full ${bg} rounded-xs`} />
          </div>
          <div className="flex gap-1 justify-between">
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
            <div className={`w-full h-3 ${bg} rounded-xs`} />
          </div>
        </div>
      </div>
    </div>
    <div className="w-20 h-12 border-x"></div>
    <div className="w-32 h-px border"></div>
  </div>
);

const AdaptiveDesign = () => {
  return (
    <section className="relative rounded-lg py-4 pb-0 w-full overflow-hidden border border-border">
      <div className="px-6">
        <h3 className="font-bold text-4xl my-2 md:my-4">Adaptive design</h3>
        <h4 className="mb-4 text-current/50">
          The platform works seamlessly on any device and any screen resolution.
        </h4>
      </div>
      <motion.div
        className="overflow-hidden py-6 my-auto"
        initial={{ opacity: 0, y: 70 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="relative h-96 my-auto">
          <div className="absolute flex left-0 top-0 w-full mask-r-from-80%">
            <div className="flex items-center gap-8 p-4 mx-auto">
              <Smartphone />
              <Tablet />
              <Desktop />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AdaptiveDesign;
