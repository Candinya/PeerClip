import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { TrashIcon } from "@heroicons/react/24/outline";

import { SetClipboard } from "../wailsjs/go/main/App";
import { EventsOn, EventsOff } from "../wailsjs/runtime";

import { clipboardHistoryAtom } from "./atoms/clipboardHistory";
import type { ClipboardHistory } from "./atoms/clipboardHistory";
import HistoryCard from "./components/HistoryCard";
import LongPressButton from "./components/LongPressButton";

function App() {
  const [clipboardHistory, setClipboardHistory] = useAtom(clipboardHistoryAtom);
  const [currentActiveHash, setCurrentActiveHash] = useState("");

  const getCurrentHistory = useAtomCallback(
    useCallback((get) => {
      return get(clipboardHistoryAtom);
    }, []),
  );

  useEffect(() => {
    EventsOn("clipboard-change", (hash: string, content: string) => {
      const currentHistory = getCurrentHistory();
      // Check if need to append to history array
      if (!currentHistory.some((h) => h.hash === hash)) {
        setClipboardHistory([
          {
            type: "text",
            hash,
            content,
          },
          ...currentHistory,
        ]);
      }
      // Set active hash anyway
      setCurrentActiveHash(hash);
    });

    return () => {
      EventsOff("clipboard-change");
    };
  }, []);

  const setActive = (history: ClipboardHistory) => {
    if (history.hash !== currentActiveHash) {
      SetClipboard(history.content);
    }
  };

  const deleteHistory = (hash: string) => {
    if (hash === currentActiveHash) {
      // Ignore
      return;
    }
    const hIndex = clipboardHistory.findIndex((h) => h.hash === hash);
    if (hIndex > -1) {
      setClipboardHistory(clipboardHistory.splice(hIndex, 1));
    }
  };

  const purgeHistory = () => {
    const currentActive = clipboardHistory.find(
      (h) => h.hash === currentActiveHash,
    );
    setClipboardHistory(currentActive ? [currentActive] : []);
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col">
      {/*History list*/}
      <div className="grow h-0 overflow-y-auto p-4 pb-2">
        <ul className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl gap-4">
          {clipboardHistory.map((h) => (
            <HistoryCard
              key={h.hash}
              h={h}
              isActive={currentActiveHash === h.hash}
              setActive={setActive}
              del={deleteHistory}
            />
          ))}
        </ul>
      </div>

      {/*Purge button*/}
      <div className="px-4 py-2 md:px-8 md:py-4 w-full max-w-7xl mx-auto">
        <LongPressButton onTrigger={purgeHistory} time={2_000}>
          <TrashIcon className="size-6 mx-auto" />
        </LongPressButton>
      </div>
    </div>
  );
}

export default App;
