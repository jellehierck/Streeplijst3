import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Use an event handler. Source: https://usehooks-ts.com/react-hook/use-event-listener
 * @param eventName Event name to use
 * @param handler Handler function to call when the even fires
 */
function useEventListener<K extends keyof WindowEventMap>(
  eventName : K,
  handler : (event : WindowEventMap[K]) => void,
) : void
function useEventListener<K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement>(
  eventName : K,
  handler : (event : HTMLElementEventMap[K]) => void,
  element : RefObject<T>,
) : void

/**
 * Use an event handler. Source: https://usehooks-ts.com/react-hook/use-event-listener
 * @param eventName Event name to use
 * @param handler Handler function to call when the even fires
 * @param element Listening target
 */
function useEventListener<KW extends keyof WindowEventMap, KH extends keyof HTMLElementEventMap, T extends HTMLElement | void = void>(
  eventName : KW | KH,
  handler : (event : WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
  element? : RefObject<T>,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement : T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener : typeof handler = event => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

export default useEventListener;
