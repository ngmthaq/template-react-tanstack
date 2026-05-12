import type { DialogProps } from "@mui/material";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import {
  type ConfirmDialogVariant,
  StyledConfirmDialogTitle,
  StyledConfirmDialogMessage,
  StyledConfirmDialogSubMessage,
} from "./styled";

export interface AppConfirmDialogProps {
  open: boolean;
  header?: string;
  message: string;
  subMessage?: string;
  variant?: ConfirmDialogVariant;
  cancelTitle?: string;
  confirmTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AppConfirmDialog({
  open,
  header = "Confirmation",
  message,
  subMessage,
  variant = "default",
  cancelTitle = "Cancel",
  confirmTitle = "Confirm",
  onCancel,
  onConfirm,
}: AppConfirmDialogProps) {
  const handleClose: DialogProps["onClose"] = (_event, reason) => {
    if (reason === "backdropClick") return;
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledConfirmDialogTitle>{header}</StyledConfirmDialogTitle>
      <DialogContent>
        <StyledConfirmDialogMessage>{message}</StyledConfirmDialogMessage>
        {subMessage && (
          <StyledConfirmDialogSubMessage colorVariant={variant}>
            {subMessage}
          </StyledConfirmDialogSubMessage>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelTitle}</Button>
        <Button onClick={onConfirm} variant="contained">
          {confirmTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
