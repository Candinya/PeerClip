import type { ClipboardHistory } from "../atoms/clipboardHistory";

interface HistoryCardProps {
  h: ClipboardHistory;
  isActive: boolean;
  setActive: (h: ClipboardHistory) => void;
}
const HistoryCard = ({ h, isActive, setActive }: HistoryCardProps) => (
  <li
    onClick={() => setActive(h)}
    className={`ring-3 ${isActive ? "ring-blue-400 dark:ring-blue-600" : "ring-gray-300 dark:ring-gray-700 hover:ring-blue-300/75 dark:hover:ring-blue-700/65"} bg-gray-200/75 hover:bg-gray-200/60 dark:bg-gray-800 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer px-4 py-3 rounded-lg shadow-md hover:shadow-lg min-h-16`}
  >
    <p className="whitespace-pre overflow-ellipsis line-clamp-12">
      {h.content}
    </p>
  </li>
);

export default HistoryCard;
