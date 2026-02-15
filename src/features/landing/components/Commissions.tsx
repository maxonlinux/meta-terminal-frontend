import { motion } from "motion/react";

function Commissions() {
  return (
    <section
      className="relative rounded-lg p-6 w-full border border-border"
      // style={{
      //   backgroundImage: "url('/landing/tiles/wide.svg')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <h3 className="font-bold text-4xl mt-2 mb-4">Commissions</h3>
      <h4 className="border-solid border-spacing-y-10 sm:border-b sm:border-white/10 opacity-70 pb-5">
        Trade fees are based on your trading volume in the past week.
      </h4>
      <div className="flex items-end gap-4 max-md:flex-col max-md:items-center">
        <div className="grid md:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col w-full">
            <h4 className="my-3 font-semibold">STOCKS</h4>
            <div className="flex justify-between mb-2 border-solid border-spacing-y-10 border-y border-white/10 opacity-70 py-3">
              <dt>Turnover</dt>
              <dd>Commission</dd>
            </div>
            <motion.ol
              className="overflow-hidden flex flex-col justify-between"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="flex justify-between mb-2">
                <dt>$0−50K</dt>
                <dd>0,04%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$50K−250K</dt>
                <dd>0,035%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$250K−1.5M</dt>
                <dd>0,03%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$1.5M−3.75M</dt>
                <dd>0,025%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$3.75M−∞</dt>
                <dd>0,02%</dd>
              </div>
            </motion.ol>
          </div>
          <div className="flex flex-col">
            <h4 className="my-3 font-semibold">CRYPTOCURRENCY</h4>
            <div className="flex justify-between mb-2 border-solid border-spacing-y-10 border-white/10 border-t border-b pb-3 pt-3">
              <dt>Turnover</dt>
              <dd>Commission</dd>
            </div>
            <motion.ol
              className="overflow-hidden flex flex-col justify-between"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="flex justify-between mb-2">
                <dt>$0−50K</dt>
                <dd>0,04%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$50K−250K</dt>
                <dd>0,035%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$250K−1.5M</dt>
                <dd>0,03%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$1.5M−3.75M</dt>
                <dd>0,025%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$3.75M−∞</dt>
                <dd>0,02%</dd>
              </div>
            </motion.ol>
          </div>
          <div className="flex flex-col">
            <h4 className="my-3 font-semibold">METALS</h4>
            <div className="flex justify-between mb-2 border-solid border-spacing-y-10 border-white/10 border-t border-b opacity-70 pb-3 pt-3">
              <dt>Turnover</dt>
              <dd>Commission</dd>
            </div>
            <motion.ol
              className="overflow-hidden flex flex-col justify-between"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="flex justify-between mb-2">
                <dt>$0−50K</dt>
                <dd>0,04%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$50K−250K</dt>
                <dd>0,035%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$250K−1.5M</dt>
                <dd>0,03%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$1.5M−3.75M</dt>
                <dd>0,025%</dd>
              </div>
              <div className="flex justify-between mb-2">
                <dt>$3.75M−∞</dt>
                <dd>0,02%</dd>
              </div>
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Commissions;
