import { DialogTitle, Typography, styled } from "@mui/material";

export type AlertDialogVariant = "default" | "success" | "danger";

export const StyledAlertDialogTitle = styled(DialogTitle)({});

export const StyledAlertDialogMessage = styled(Typography)({});

export const StyledAlertDialogSubMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorVariant",
})<{ colorVariant?: AlertDialogVariant }>(
  ({ theme, colorVariant = "default" }) => ({
    marginTop: theme.spacing(1),
    color:
      colorVariant === "success"
        ? theme.palette.success.main
        : colorVariant === "danger"
          ? theme.palette.error.main
          : theme.palette.text.secondary,
    fontSize: "0.875rem",
  }),
);
