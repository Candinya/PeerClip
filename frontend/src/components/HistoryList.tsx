import HistoryCard from "./HistoryCard";
import type { ClipboardHistory } from "../atoms/clipboardHistory";

interface HistoryListProps {
  clipboardHistory: ClipboardHistory[];
  currentActiveHash: string;
  setActive: (h: ClipboardHistory) => void;
}
const HistoryList = ({
  clipboardHistory,
  currentActiveHash,
  setActive,
}: HistoryListProps) => (
  <ul className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl gap-4">
    {clipboardHistory.map((h) => (
      <HistoryCard
        key={h.hash}
        h={h}
        isActive={currentActiveHash === h.hash}
        setActive={setActive}
      />
    ))}
  </ul>
);

export default HistoryList;
