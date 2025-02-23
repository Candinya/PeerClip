import HistoryCard from "./HistoryCard";
import {
  ClipboardHistory,
  clipboardHistoryAtom,
} from "../atoms/clipboardHistory";
import { useAtom } from "jotai";
import { SetClipboard } from "../../wailsjs/go/main/App";
import { AnimatePresence } from "motion/react";

interface HistoryListProps {
  currentActiveHash: string;
}
const HistoryList = ({ currentActiveHash }: HistoryListProps) => {
  const [clipboardHistory, setClipboardHistory] = useAtom(clipboardHistoryAtom);

  const setActive = (history: ClipboardHistory) => {
    if (history.hash !== currentActiveHash) {
      SetClipboard(history.content);
    }
  };

  const setPinned = (
    history: ClipboardHistory,
    index: number,
    state: boolean,
  ) => {
    if (history.isPinned !== state) {
      // Update element
      const newClipboardHistory = structuredClone(clipboardHistory);
      newClipboardHistory.splice(index, 1, {
        ...history,
        isPinned: state,
      });
      // Update array
      setClipboardHistory(newClipboardHistory);
    }
  };

  const del = (index: number) => {
    // Delete element
    const newClipboardHistory = structuredClone(clipboardHistory);
    newClipboardHistory.splice(index, 1);
    // Update array
    setClipboardHistory(newClipboardHistory);
  };

  return (
    <ul className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl gap-4">
      <AnimatePresence>
        {clipboardHistory.map((h, index) => (
          <HistoryCard
            key={h.hash}
            h={h}
            isActive={currentActiveHash === h.hash}
            setActive={() => setActive(h)}
            setPinned={(state) => setPinned(h, index, state)}
            del={() => del(index)}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default HistoryList;
