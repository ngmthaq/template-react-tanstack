import { useEffect, useRef, useState } from "react";

export function useWindowResize() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }, 150);
    });
  }, []);

  return { width, height };
}
