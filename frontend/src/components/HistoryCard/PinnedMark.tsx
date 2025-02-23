import { motion } from "motion/react";

const PinnedMark = () => (
  <motion.div
    className="absolute w-4 h-4 rounded-full -top-2 -right-2 bg-green-400 dark:bg-green-700"
    initial={{
      scale: 0,
    }}
    animate={{
      scale: 1,
    }}
    exit={{
      scale: 0,
    }}
  />
);

export default PinnedMark;
