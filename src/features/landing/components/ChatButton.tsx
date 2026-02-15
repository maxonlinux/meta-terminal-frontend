"use client";

import { MessageSquareDot } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import type { RefObject } from "react";
import { useEnv } from "@/env/provider";

function ChatButton({
  authButtonsRef,
}: {
  authButtonsRef: RefObject<HTMLDivElement | null>;
}) {
  const env = useEnv();

  const isAuthButtonsInView = useInView(authButtonsRef);

  const animationVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 100 },
  };

  return (
    <AnimatePresence>
      {!isAuthButtonsInView && (
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          className="fixed flex flex-col z-50 bottom-0 w-full
          sm:hidden"
        >
          <Link
            href={env.SUPPORT_LINK}
            className="absolute right-0 bottom-full m-4 inline-flex gap-2 items-center justify-center z-50 px-6 h-10 border border-white/10 backdrop-blur-sm rounded-full shrink-0 shadow-md"
          >
            <MessageSquareDot size={16} />
            <span className="text-sm font-medium">Chat</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatButton;
