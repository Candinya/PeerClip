import HistoryCard from "./HistoryCard";
import {
  ClipboardContentFormatReverseMap,
  ClipboardHistory,
  clipboardHistoryAtom,
} from "../atoms/clipboardHistory";
import { useAtom } from "jotai";
import { SetClipboard } from "../../wailsjs/go/main/App";
import { AnimatePresence } from "motion/react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface HistoryListProps {
  currentActiveHash: string;
}
const HistoryList = ({ currentActiveHash }: HistoryListProps) => {
  const [clipboardHistory, setClipboardHistory] = useAtom(clipboardHistoryAtom);

  const setActive = (history: ClipboardHistory) => {
    if (history.hash !== currentActiveHash) {
      SetClipboard(
        ClipboardContentFormatReverseMap[history.format],
        history.content,
      );
    }
  };

  const setPinned = (
    history: ClipboardHistory,
    index: number,
    state: boolean,
  ) => {
    if (history.isPinned !== state) {
      const newClipboardHistory = structuredClone(clipboardHistory);
      // Update element
      newClipboardHistory.splice(index, 1, {
        ...history,
        isPinned: state,
      });
      // Update array
      setClipboardHistory(newClipboardHistory);
    }
  };

  const del = (index: number) => {
    const newClipboardHistory = structuredClone(clipboardHistory);
    // Delete element
    newClipboardHistory.splice(index, 1);
    // Update array
    setClipboardHistory(newClipboardHistory);
  };

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        if (destination) {
          const newClipboardHistory = structuredClone(clipboardHistory);
          // Delete element
          const fromItem = newClipboardHistory.splice(source.index, 1);
          // Insert element
          newClipboardHistory.splice(destination.index, 0, ...fromItem);
          // Update array
          setClipboardHistory(newClipboardHistory);
        }
      }}
    >
      <Droppable droppableId="clipboard-history-list" direction="vertical">
        {(provided) => (
          <ul
            className="mx-auto flex flex-col max-w-7xl"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <AnimatePresence>
              {clipboardHistory.map((h, index) => (
                <HistoryCard
                  key={h.hash}
                  h={h}
                  index={index}
                  isActive={currentActiveHash === h.hash}
                  setActive={() => setActive(h)}
                  setPinned={(state) => setPinned(h, index, state)}
                  del={() => del(index)}
                />
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default HistoryList;
