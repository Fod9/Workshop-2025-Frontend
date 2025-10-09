import { useEffect, useRef } from "react";

type Options = {
  src?: string;
  durationMs?: number;
  volume?: number;
};

// Singleton manager to prevent stacking multiple audios
let sharedAudio: HTMLAudioElement | null = null;
let sharedSrc: string | null = null;
let sharedVolume = 0.15;
let currentToken: symbol | null = null;
let unlockHandler: (() => void) | null = null;
let stopTimer: number | null = null;

function ensureAudio(src: string, volume: number) {
  if (!sharedAudio || sharedSrc !== src) {
    try { sharedAudio?.pause(); } catch {}
    sharedAudio = new Audio(src);
    sharedAudio.loop = true;
    sharedSrc = src;
  }
  sharedAudio!.volume = volume;
  sharedVolume = volume;
}

function cleanupUnlock() {
  if (unlockHandler) {
    window.removeEventListener('pointerdown', unlockHandler);
    window.removeEventListener('keydown', unlockHandler);
    unlockHandler = null;
  }
}

function stopIfOwner(token: symbol) {
  if (currentToken === token) {
    try { sharedAudio?.pause(); } catch {}
    currentToken = null;
    cleanupUnlock();
    if (stopTimer) {
      window.clearTimeout(stopTimer);
      stopTimer = null;
    }
  }
}

export function useTypingSound(active: boolean, opts: Options = {}) {
  const { src = "/assets/typing_morse.mp3", durationMs = 6500, volume = 0.15 } = opts;
  const tokenRef = useRef<symbol>(Symbol("typing-sound"));

  // Keep audio instance configured
  useEffect(() => {
    if (typeof window === 'undefined') return;
    ensureAudio(src, volume);
    return () => {
      // Stop if we own playback
      stopIfOwner(tokenRef.current);
    };
  }, [src, volume]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    ensureAudio(src, volume);
    const audio = sharedAudio!;
    const token = tokenRef.current;

    const requestPlay = () => {
      // Stop previous owner, take control
      if (currentToken && currentToken !== token) {
        try { audio.pause(); } catch {}
      }
      currentToken = token;
      cleanupUnlock();
      const p = audio.play();
      if (p && typeof (p as Promise<unknown>).catch === 'function') {
        (p as Promise<unknown>).catch(() => {
          if (unlockHandler) return;
          unlockHandler = () => {
            try { audio.play().catch(() => {}); } finally {
              cleanupUnlock();
            }
          };
          window.addEventListener('pointerdown', unlockHandler, { once: true });
          window.addEventListener('keydown', unlockHandler, { once: true });
        });
      }
      if (stopTimer) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        stopIfOwner(token);
      }, Math.max(0, durationMs));
    };

    if (active) {
      try { audio.currentTime = 0; } catch {}
      requestPlay();
    } else {
      stopIfOwner(token);
    }
  }, [active, src, volume, durationMs]);
}
