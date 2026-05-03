import { useEffect } from "react";
import { eventBus, type EventBusListener } from "@/utils";

export function useEventBusListener<T>(
  event: string,
  listener: EventBusListener<T>,
) {
  useEffect(() => {
    const cleanup = eventBus.on(event, listener);
    return () => {
      cleanup();
    };
  }, [event, listener]);
}
