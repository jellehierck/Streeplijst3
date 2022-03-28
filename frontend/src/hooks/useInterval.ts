import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Call a function periodcally after a delay. Setting the delay to null or undefined causes the timeout to stop without
 * firing. Source: https://usehooks-ts.com/react-hook/use-interval
 * @param callback Function to call upon timeout expiration
 * @param delay Delay in ms. When set to null or undefined, the interval is canceled and the callback is not called.
 */
function useInterval(callback : () => void, delay : number | null | undefined) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id); // Cleanup when the component using the interval is removed
  }, [delay]);
}

export default useInterval;
