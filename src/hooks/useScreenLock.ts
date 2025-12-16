'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export function useScreenLock({
  timeoutMinutes = 10,
  checkPassword,
}: {
  timeoutMinutes?: number;
  checkPassword: (pw: string) => boolean | Promise<boolean>;
}) {
  const [locked, setLocked] = useState(() => {
    // Safe SSR check
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('locked') === 'true';
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Initialize BroadcastChannel once
  if (typeof window !== 'undefined' && !channelRef.current) {
    channelRef.current = new BroadcastChannel('app-lock');
  }

  // Stable resetTimer function
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      localStorage.setItem('locked', 'true');
      channelRef.current?.postMessage({ type: 'locked' });
      setLocked(true);
    }, timeoutMinutes * 60_000);
  }, [timeoutMinutes]);

  // Stable markActive function with throttling
  const markActive = useCallback(() => {
    if (locked) return;

    const now = Date.now();

    // Throttle: Only update if at least 1 second has passed
    if (now - lastActivityRef.current < 1000) return;

    lastActivityRef.current = now;
    localStorage.setItem('lastActivity', now.toString());
    channelRef.current?.postMessage({ type: 'activity', time: now });
    resetTimer();
  }, [locked, resetTimer]);

  // Listen for user activity
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Add event listeners with passive where appropriate
    events.forEach((evt) => {
      window.addEventListener(evt, markActive, { passive: true });
    });

    document.addEventListener('visibilitychange', markActive);

    // Initialize with current activity
    markActive();

    return () => {
      // Cleanup event listeners
      events.forEach((evt) => {
        window.removeEventListener(evt, markActive);
      });
      document.removeEventListener('visibilitychange', markActive);

      // Cleanup timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [markActive]);

  // Handle messages from other tabs
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;

    const handler = (e: MessageEvent) => {
      try {
        switch (e.data.type) {
          case 'locked':
            setLocked(true);
            break;

          case 'unlocked':
            setLocked(false);
            // Reset activity when unlocked from another tab
            lastActivityRef.current = Date.now();
            localStorage.setItem('lastActivity', lastActivityRef.current.toString());
            if (!timerRef.current) {
              resetTimer();
            }
            break;

          case 'activity':
            if (!locked) {
              lastActivityRef.current = e.data.time;
              localStorage.setItem('lastActivity', e.data.time.toString());
              resetTimer();
            }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error('Error handling broadcast message:', error);
      }
    };

    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, [locked, resetTimer]);

  // Unlock function with error handling
  const unlock = useCallback(
    async (pw: string): Promise<boolean> => {
      try {
        const isValid = await checkPassword(pw);

        if (isValid) {
          const now = Date.now();
          localStorage.setItem('locked', 'false');
          localStorage.setItem('lastActivity', now.toString());
          lastActivityRef.current = now;

          channelRef.current?.postMessage({ type: 'unlocked' });
          setLocked(false);
          resetTimer();
          return true;
        }

        return false;
      } catch (error) {
        console.error('Error during unlock:', error);
        return false;
      }
    },
    [checkPassword, resetTimer]
  );

  // Manual lock function (optional enhancement)
  const lock = useCallback(() => {
    localStorage.setItem('locked', 'true');
    channelRef.current?.postMessage({ type: 'locked' });
    setLocked(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup BroadcastChannel on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, []);

  return {
    locked,
    unlock,
    lock, // optional: export manual lock function
  };
}
