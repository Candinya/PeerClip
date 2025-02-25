import type { ClipboardHistory } from "../../atoms/clipboardHistory";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Draggable } from "@hello-pangea/dnd";
import PinnedMark from "./PinnedMark";
import ContextMenu from "./ContextMenu";

interface HistoryCardProps {
  h: ClipboardHistory;
  index: number;
  isActive: boolean;
  setActive: () => void;
  setPinned: (state: boolean) => void;
  del: () => void;
}
const HistoryCard = ({
  h,
  index,
  isActive,
  setActive,
  setPinned,
  del,
}: HistoryCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);

  useEffect(() => {
    if (isActive) {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  const openContextMenu = (ev: MouseEvent<HTMLDivElement>) => {
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
    <Draggable draggableId={h.hash} index={index}>
      {(provided) => (
        <li
          className="mb-4"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <motion.div
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
              {h.format === "text" ? (
                <p className="whitespace-pre overflow-ellipsis overflow-x-hidden line-clamp-8 md:line-clamp-12 xl:line-clamp-none xl:overflow-x-hidden">
                  {h.content}
                </p>
              ) : h.format === "image" ? (
                <img
                  src={`data:image/png;base64,${h.content}`}
                  alt={h.hash}
                  className="max-h-48 md:max-h-72 xl:max-h-none"
                />
              ) : (
                "Unsupported"
              )}

              {/*ContextMenu*/}
              <AnimatePresence>
                {isContextMenuOpen && (
                  <ContextMenu
                    h={h}
                    isActive={isActive}
                    setPinned={setPinned}
                    del={del}
                  />
                )}
              </AnimatePresence>

              {/*PinnedMark*/}
              <AnimatePresence>{h.isPinned && <PinnedMark />}</AnimatePresence>
            </div>
          </motion.div>
        </li>
      )}
    </Draggable>
  );
};

export default HistoryCard;
