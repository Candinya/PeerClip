import { motion } from "motion/react";
import { ShieldCheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import LongPressButton from "../LongPressButton";
import type { ClipboardHistory } from "../../atoms/clipboardHistory";

interface ContextMenuProps {
  h: ClipboardHistory;
  setPinned: (state: boolean) => void;
  del: () => void;
}
const ContextMenu = ({ h, setPinned, del }: ContextMenuProps) => (
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
);

export default ContextMenu;
