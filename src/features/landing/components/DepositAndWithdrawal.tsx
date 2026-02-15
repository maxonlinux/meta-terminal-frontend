import { motion } from "motion/react";
import Image from "next/image";

const DepositAndWithdrawal = () => {
  return (
    <motion.div
      className="mb-8 p-6"
      initial={{ opacity: 0, y: "70px" }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Image
        src="/landing/tether.png"
        alt="Tether"
        width={300}
        height={300}
        className="w-75 h-auto"
      />
    </motion.div>
  );
};

export default DepositAndWithdrawal;
