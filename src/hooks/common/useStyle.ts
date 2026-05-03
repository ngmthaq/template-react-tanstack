import { useEffect } from "react";

export function useStyle(src: string) {
  useEffect(() => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = src;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [src]);
}
