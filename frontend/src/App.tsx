import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import {
  ListBulletIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { SetClipboard } from "../wailsjs/go/main/App";
import { EventsOn, EventsOff } from "../wailsjs/runtime";

import { clipboardHistoryAtom } from "./atoms/clipboardHistory";
import type { ClipboardHistory } from "./atoms/clipboardHistory";
import HistoryCard from "./components/HistoryCard";
import LongPressButton from "./components/LongPressButton";
import { AnimateNumber } from "motion-number";

function App() {
  const [clipboardHistory, setClipboardHistory] = useAtom(clipboardHistoryAtom);
  const [currentActiveHash, setCurrentActiveHash] = useState("");
  const [peersCount, setPeersCount] = useState(0);

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

    EventsOn("peers-count", (count: number) => {
      setPeersCount(count);
    });

    return () => {
      EventsOff("clipboard-change", "peers-count");
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

      <div className="px-4 py-2 md:px-8 md:py-4 w-full max-w-7xl mx-auto flex flex-row gap-2">
        {/*History count*/}
        <div className="bg-amber-300/60 dark:bg-amber-800/30 text-amber-500 px-3 py-1 rounded-lg flex flex-row gap-1.5 items-center">
          <ListBulletIcon className="size-4" />
          <AnimateNumber className="font-semibold text-sm">
            {clipboardHistory.length}
          </AnimateNumber>
        </div>

        {/*Purge button*/}
        <LongPressButton onTrigger={purgeHistory} time={2_000}>
          <TrashIcon className="size-6 mx-auto" />
        </LongPressButton>

        {/*Peers count*/}
        <div className="bg-green-300/60 dark:bg-green-800/30 text-green-500 px-3 py-1 rounded-lg flex flex-row gap-1.5 items-center">
          <ShareIcon className="size-4" />
          <AnimateNumber className="font-semibold text-sm">
            {peersCount}
          </AnimateNumber>
        </div>
      </div>
    </div>
  );
}

export default App;
