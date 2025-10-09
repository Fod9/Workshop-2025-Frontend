import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useTypingSound } from "./useTypingSound";

export function useConsoleTypingSound(
  containerRef: RefObject<HTMLElement | null>,
  options?: { src?: string; volume?: number },
  activeFlag: boolean = true
) {
  const [active, setActive] = useState(false);

  // Play sound when any console-line is running the `typing` animation
  useEffect(() => {
    const root = containerRef.current;
    if (!activeFlag || !root) {
      setActive(false);
      return;
    }

    let activeCount = 0;
    const onStart = (e: AnimationEvent) => {
      if ((e.target as HTMLElement)?.classList?.contains('console-line') && e.animationName === 'typing') {
        activeCount += 1;
        setActive(true);
      }
    };
    const onEnd = (e: AnimationEvent) => {
      if ((e.target as HTMLElement)?.classList?.contains('console-line') && e.animationName === 'typing') {
        activeCount = Math.max(0, activeCount - 1);
        if (activeCount === 0) setActive(false);
      }
    };

    root.addEventListener('animationstart', onStart as EventListener);
    root.addEventListener('animationend', onEnd as EventListener);

    // If lines are present and already animating (rare), start immediately
    // Otherwise events will kick in.

    return () => {
      root.removeEventListener('animationstart', onStart as EventListener);
      root.removeEventListener('animationend', onEnd as EventListener);
      setActive(false);
    };
  }, [containerRef, activeFlag]);

  useTypingSound(active, { src: options?.src, volume: options?.volume });
}
