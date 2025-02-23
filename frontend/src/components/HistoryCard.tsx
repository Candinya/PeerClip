import type { ClipboardHistory } from "../atoms/clipboardHistory";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import LongPressButton from "./LongPressButton";
import { ShieldCheckIcon, TrashIcon } from "@heroicons/react/24/outline";

interface HistoryCardProps {
  h: ClipboardHistory;
  isActive: boolean;
  setActive: () => void;
  setPinned: (state: boolean) => void;
  del: () => void;
}
const HistoryCard = ({
  h,
  isActive,
  setActive,
  setPinned,
  del,
}: HistoryCardProps) => {
  const cardRef = useRef<HTMLLIElement | null>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  useEffect(() => {
    if (isActive) {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  const openContextMenu = (ev: MouseEvent<HTMLLIElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setContextMenuOpen(true);
  };

  const closeContextMenu = () => {
    if (isContextMenuOpen) {
      setContextMenuOpen(false);
    }
  };

  return (
    <motion.li
      ref={cardRef}
      onClick={setActive}
      onContextMenu={openContextMenu}
      onMouseLeave={closeContextMenu}
      initial={{
        x: 0,
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        x: 0,
        scale: 1,
        opacity: 1,
      }}
      exit={{
        x: 300,
        scale: 1,
        opacity: 0,
      }}
    >
      {/*Wrapper*/}
      <div
        className={`ring-3 ${isActive ? "ring-blue-400 dark:ring-blue-600" : "ring-gray-300 dark:ring-gray-700 hover:ring-blue-300/75 dark:hover:ring-blue-700/65"} bg-gray-200/75 hover:bg-gray-200/60 dark:bg-gray-800 dark:hover:bg-gray-700/50 duration-200 cursor-pointer px-4 py-3 rounded-lg shadow-md hover:shadow-lg min-h-16 relative`}
      >
        {/*Content*/}
        <p className="whitespace-pre overflow-ellipsis line-clamp-12">
          {h.content}
        </p>

        {/*PinnedMark*/}
        <AnimatePresence>
          {h.isPinned && (
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
          )}
        </AnimatePresence>

        {/*ContextMenu*/}
        <AnimatePresence>
          {isContextMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-full h-full flex flex-col justify-center backdrop-blur-xs rounded-lg"
              onClick={(ev) => {
                ev.stopPropagation(); // Prevent trigger setActive
              }}
            >
              <div className="w-full flex flex-row gap-4 justify-center">
                {/*Pin*/}
                <motion.button
                  className={`${
                    h.isPinned
                      ? "bg-green-500 hover:bg-green-500/75 text-white dark:text-black"
                      : "bg-green-300/60 dark:bg-green-800/30 hover:bg-green-300/75 dark:hover:bg-green-800/45 text-green-500"
                  } cursor-pointer transition-colors duration-200 px-4 py-2 rounded-lg`}
                  onClick={() => setPinned(!h.isPinned)}
                  layoutId={`history-card-${h.hash}-context-pin-button`}
                >
                  <ShieldCheckIcon className="size-5 mx-auto" />
                </motion.button>

                {/*Delete*/}
                {!h.isPinned && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <LongPressButton
                      onTrigger={del}
                      time={500}
                      basicClassName="bg-red-300/60 dark:bg-red-800/30 hover:bg-red-300/75 dark:hover:bg-red-800/45 text-red-500"
                      progressClassName="bg-red-500"
                    >
                      <TrashIcon className="size-5 mx-auto" />
                    </LongPressButton>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
};

export default HistoryCard;
