import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Call a function periodcally after a delay. Setting the delay to null or undefined causes the timeout to stop without
 * firing. Source: https://usehooks-ts.com/react-hook/use-interval
 * @param callback Function to call upon timeout expiration
 * @param delay Delay in ms. When set to null or undefined, the interval is canceled and the callback is not called.
 */
function useInterval(callback : () => void, delay : number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Do not set the interval if the delay is set to null
    if (delay === null) {
      return;
    }

    // If the delay is a number (0 is also accepted), set an interval for that delay
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id); // Cleanup when the component using the interval is removed

  }, [delay]);
}

export default useInterval;
