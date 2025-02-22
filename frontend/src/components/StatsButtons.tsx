import {
  ListBulletIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimateNumber } from "motion-number";
import LongPressButton from "./LongPressButton";

interface StatsButtonsProps {
  historyLength: number;
  peersCount: number;
  purgeHistory: () => void;
}

const StatsButtons = ({
  historyLength,
  peersCount,
  purgeHistory,
}: StatsButtonsProps) => (
  <>
    {/*History count*/}
    <div className="bg-amber-300/60 dark:bg-amber-800/30 text-amber-500 px-3 py-1 rounded-lg flex flex-row gap-1.5 items-center">
      <ListBulletIcon className="size-4" />
      <AnimateNumber className="font-semibold text-sm">
        {historyLength}
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
  </>
);

export default StatsButtons;
