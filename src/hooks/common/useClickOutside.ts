import { useEffect, type RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    if (ref.current === null) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
}
