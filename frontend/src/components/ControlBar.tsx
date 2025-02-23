import {
  ListBulletIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimateNumber } from "motion-number";
import LongPressButton from "./LongPressButton";

interface ControlBarProps {
  historyLength: number;
  peersCount: number;
  purgeHistory: () => void;
}

const ControlBar = ({
  historyLength,
  peersCount,
  purgeHistory,
}: ControlBarProps) => (
  <>
    {/*History count*/}
    <div className="bg-amber-300/60 dark:bg-amber-800/30 text-amber-500 px-3 py-1 rounded-lg flex flex-row gap-1.5 items-center">
      <ListBulletIcon className="size-4" />
      <AnimateNumber className="font-semibold text-sm">
        {historyLength}
      </AnimateNumber>
    </div>

    {/*Purge button*/}
    <LongPressButton
      onTrigger={purgeHistory}
      time={2_000}
      basicClassName={
        "grow bg-red-300/60 dark:bg-red-800/30 hover:bg-red-300/75 dark:hover:bg-red-800/45 text-red-500"
      }
      progressClassName={"bg-red-500"}
    >
      <TrashIcon className="size-6 mx-auto" />
    </LongPressButton>

    {/*Peers count*/}
    <div className="bg-indigo-300/60 dark:bg-indigo-800/30 text-indigo-500 px-3 py-1 rounded-lg flex flex-row gap-1.5 items-center">
      <ShareIcon className="size-4" />
      <AnimateNumber className="font-semibold text-sm">
        {peersCount}
      </AnimateNumber>
    </div>
  </>
);

export default ControlBar;
