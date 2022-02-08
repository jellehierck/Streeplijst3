import React, { useEffect, useRef } from "react"

/**
 * Calls a callback only when a component changes after its initial render, whereas useEffect() would also fire when
 * the component is intially rendered. Source:
 * https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/4-useUpdateEffect/useUpdateEffect.js
 * @param callback Function to fire when one of the dependencies is updated
 * @param dependencies If any of the elements in this list change, the callback is fired
 */
export default function useUpdateEffect(callback : () => void, dependencies : React.DependencyList | undefined) {
  // Ref to make sure the update of useEffect on the initial render is ignored
  const firstRenderRef = useRef(true)

  // useEffect hook to update the
  useEffect(() => {
    if (firstRenderRef.current) {  // Ignore the effect update on the initial render
      firstRenderRef.current = false  // Set to not ignore any subsequent effect updates
      return
    }
    return callback()  // Call the callback
  }, [callback, dependencies]);  // Run this function again upon dependencies or callback changes
}