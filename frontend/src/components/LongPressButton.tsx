import { PropsWithChildren, useRef } from "react";

interface LongPressButtonProps extends PropsWithChildren {
  onTrigger: () => void;
  time: number;
  basicClassName: string;
  progressClassName: string;
}
const LongPressButton = ({
  onTrigger,
  time,
  children,
  basicClassName,
  progressClassName,
}: LongPressButtonProps) => {
  const startTsRef = useRef<number>(-1);
  const processBarRef = useRef<HTMLDivElement | null>(null);

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
    <div
      className={`transition-colors duration-200 px-4 py-2 rounded-lg cursor-pointer relative overflow-clip ${
        basicClassName
      }`}
      onMouseDown={startTiming}
      onMouseUp={stopTiming}
      onMouseLeave={stopTiming}
    >
      <div
        ref={processBarRef}
        className={`absolute top-0 left-0 h-full transition-all ${
          progressClassName
        }`}
      />
      {children}
    </div>
  );
};

export default LongPressButton;
