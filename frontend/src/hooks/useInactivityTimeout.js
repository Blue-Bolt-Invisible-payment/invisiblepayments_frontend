import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to handle user inactivity timeout
 * @param {function} onTimeout - Callback function when timeout occurs
 * @param {number} timeoutMs - Timeout in milliseconds (default: 15 minutes)
 * @param {boolean} isActive - Whether the timeout should be active
 * @returns {function} resetTimer - allows manual reset if needed
 */
const useInactivityTimeout = (onTimeout, timeoutMs = 900000, isActive = true) => {
  const timeoutRef = useRef(null);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isActive) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, timeoutMs);
    }
  }, [onTimeout, timeoutMs, isActive]);

  // Activity event handler
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!isActive) return;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    resetTimer();
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleActivity, resetTimer, isActive]);

  return resetTimer; // expose reset function if you want to trigger manually
};

export default useInactivityTimeout;
