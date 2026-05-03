import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, type PropsWithChildren } from "react";
import { useThemeStore } from "@/hooks";
import { theme as defaultTheme } from "./theme";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const { theme: currentTheme } = useThemeStore();
  const theme = useMemo(() => {
    return currentTheme || defaultTheme;
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme} noSsr disableTransitionOnChange>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
