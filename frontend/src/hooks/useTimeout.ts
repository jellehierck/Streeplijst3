import { useEffect, useLayoutEffect, useRef } from "react"

/**
 * Call a function after a delay. Setting the delay to null or undefined causes the timeout to stop without firing.
 * Source: https://usehooks-ts.com/react-hook/use-timeout
 * @param callback Function to call upon timeout expiration
 * @param delay Delay in ms. When set to null or undefined, the timeout is canceled and the callback is not called.
 */
function useTimeout(callback : () => void, delay : number | undefined | null) : void {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === undefined || delay === null) {
      return
    }

    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}

export default useTimeout