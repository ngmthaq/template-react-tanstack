import { createTheme, type Theme, type ThemeOptions } from "@mui/material";
import { atom, useAtom } from "jotai";
import { theme as defaultTheme } from "@/providers";

export const themeAtom = atom<Theme | null>(null);
themeAtom.debugLabel = "themeAtom";

export function useThemeStore() {
  const [theme, _setTheme] = useAtom(themeAtom);

  const setTheme = (options: ThemeOptions) => {
    const currentTheme = theme || defaultTheme;
    const newTheme = createTheme(currentTheme, options);
    _setTheme(newTheme);
  };

  return {
    theme: theme,
    setTheme: setTheme,
    originalSetTheme: _setTheme,
  } as const;
}
