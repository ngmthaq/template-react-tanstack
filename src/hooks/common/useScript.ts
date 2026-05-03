import { useEffect } from "react";

export function useScript(
  src: string,
  onLoad?: () => void,
  onError?: OnErrorEventHandler,
) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    if (onLoad) script.onload = onLoad;
    if (onError) script.onerror = onError;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [src, onLoad, onError]);
}
