import type { PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";
import { AppNotification } from "@/components/atoms";

export function AppNotificationProvider({ children }: PropsWithChildren) {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      Components={{
        default: AppNotification,
        success: AppNotification,
        error: AppNotification,
        warning: AppNotification,
        info: AppNotification,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
