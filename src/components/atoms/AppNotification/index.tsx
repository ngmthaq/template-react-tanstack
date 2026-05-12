import type { AlertColor } from "@mui/material";
import type { CustomContentProps } from "notistack";
import { forwardRef } from "react";
import { StyledNotificationAlert } from "./styled";

export type AppNotificationProps = CustomContentProps;

const variantToSeverity: Record<string, AlertColor> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
  default: "info",
};

export const AppNotification = forwardRef<HTMLDivElement, AppNotificationProps>(
  function AppNotification({ message, variant }, ref) {
    const severity = variantToSeverity[variant] ?? "info";

    return (
      <StyledNotificationAlert ref={ref} severity={severity}>
        {message}
      </StyledNotificationAlert>
    );
  },
);
