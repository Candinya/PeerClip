import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { EventsOn, EventsOff } from "../wailsjs/runtime";

import { clipboardHistoryAtom } from "./atoms/clipboardHistory";
import HistoryList from "./components/HistoryList";
import ControlBar from "./components/ControlBar";

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
            isPinned: false,
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

  const purgeHistory = () => {
    setClipboardHistory(
      clipboardHistory.filter(
        (h) => h.isPinned || h.hash === currentActiveHash,
      ),
    );
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col">
      {/*History list*/}
      <div className="grow h-0 overflow-x-clip overflow-y-auto p-4 pb-2">
        <HistoryList currentActiveHash={currentActiveHash} />
      </div>

      {/*Stats & Buttons*/}
      <div className="px-4 py-2 md:px-8 md:py-4 w-full max-w-7xl mx-auto flex flex-row gap-2">
        <ControlBar
          historyLength={clipboardHistory.length}
          peersCount={peersCount}
          purgeHistory={purgeHistory}
        />
      </div>
    </div>
  );
}

export default App;
