import { DialogTitle, Typography, styled } from "@mui/material";

export type ConfirmDialogVariant = "default" | "success" | "danger";

export const StyledConfirmDialogTitle = styled(DialogTitle)({});

export const StyledConfirmDialogMessage = styled(Typography)({});

export const StyledConfirmDialogSubMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorVariant",
})<{ colorVariant?: ConfirmDialogVariant }>(
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
