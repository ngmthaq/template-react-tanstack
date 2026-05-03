import { useEffect } from "react";

export function useEventListener(
  event: string,
  listener: EventListenerOrEventListenerObject,
  target: EventTarget = window,
) {
  useEffect(() => {
    target.addEventListener(event, listener);
    return () => {
      target.removeEventListener(event, listener);
    };
  }, [event, listener, target]);
}
