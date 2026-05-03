import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const isAFKAtom = atom<boolean>(false);
isAFKAtom.debugLabel = "isAFKAtom";

export function useAFKStore(afkTime: number = 30 * 60 * 1000) {
  const [isAFK, setIsAFK] = useAtom(isAFKAtom);

  useEffect(() => {
    let afkTimeout: ReturnType<typeof setTimeout>;
    const resetAFKTimer = () => {
      clearTimeout(afkTimeout);
      setIsAFK(false);
      afkTimeout = setTimeout(() => setIsAFK(true), afkTime);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    resetAFKTimer();
    events.forEach((event) => window.addEventListener(event, resetAFKTimer));

    return () => {
      clearTimeout(afkTimeout);
      events.forEach((event) =>
        window.removeEventListener(event, resetAFKTimer),
      );
    };
  }, [afkTime, setIsAFK]);

  return isAFK;
}
