import { PropsWithChildren, useRef } from "react";

interface LongPressButtonProps extends PropsWithChildren {
  onTrigger: () => void;
  time: number;
}
const LongPressButton = ({
  onTrigger,
  time,
  children,
}: LongPressButtonProps) => {
  const startTsRef = useRef<number>(-1);
  const processBarRef = useRef<HTMLDivElement>(null);

  const timingFunc = () => {
    if (startTsRef.current === -1) {
      // Stop
      return;
    }

    // Calculate delta timestamp (ms)
    const deltaTs = Date.now() - startTsRef.current;

    // Check if is finish
    if (deltaTs > time) {
      // Finish
      onTrigger();
      stopTiming();
      return;
    }

    // Not finished yet, show process
    if (processBarRef.current) {
      processBarRef.current.style.width = `${(deltaTs / time) * 100}%`;
    }

    // Next frame
    requestAnimationFrame(timingFunc);
  };

  const startTiming = () => {
    startTsRef.current = Date.now();

    // Start process
    if (processBarRef.current) {
      processBarRef.current.style.transitionDuration = "0ms";
    }

    requestAnimationFrame(timingFunc);
  };

  const stopTiming = () => {
    startTsRef.current = -1;

    // Clear process
    if (processBarRef.current) {
      processBarRef.current.style.transitionDuration = "200ms";
      processBarRef.current.style.width = `0%`;
    }
  };

  return (
    <button
      className="bg-red-300/60 dark:bg-red-800/30 hover:bg-red-300/75 dark:hover:bg-red-800/45 transition-colors duration-200 text-red-500 py-2 rounded-lg w-full cursor-pointer relative overflow-clip"
      onMouseDown={startTiming}
      onMouseUp={stopTiming}
      onMouseLeave={stopTiming}
    >
      <div
        ref={processBarRef}
        className="absolute top-0 left-0 h-full transition-all bg-red-500"
      ></div>
      {children}
    </button>
  );
};

export default LongPressButton;
