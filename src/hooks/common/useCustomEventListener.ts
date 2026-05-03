import { useEffect } from "react";
import { customEvent, type CustomEventClassListener } from "@/utils";

export function useCustomEventListener<T>(
  event: string,
  listener: CustomEventClassListener<T>,
) {
  useEffect(() => {
    const cleanup = customEvent.on(event, listener);
    return () => {
      cleanup();
    };
  }, [event, listener]);
}
