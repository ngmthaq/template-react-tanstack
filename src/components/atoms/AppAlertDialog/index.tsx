import type { DialogProps } from "@mui/material";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import {
  type AlertDialogVariant,
  StyledAlertDialogTitle,
  StyledAlertDialogMessage,
  StyledAlertDialogSubMessage,
} from "./styled";

export interface AppAlertDialogProps {
  open: boolean;
  header?: string;
  message: string;
  subMessage?: string;
  variant?: AlertDialogVariant;
  okayTitle?: string;
  onClose: () => void;
}

export function AppAlertDialog({
  open,
  header = "Notice",
  message,
  subMessage,
  variant = "default",
  okayTitle = "Okay",
  onClose,
}: AppAlertDialogProps) {
  const handleClose: DialogProps["onClose"] = (_event, reason) => {
    if (reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledAlertDialogTitle>{header}</StyledAlertDialogTitle>
      <DialogContent>
        <StyledAlertDialogMessage>{message}</StyledAlertDialogMessage>
        {subMessage && (
          <StyledAlertDialogSubMessage colorVariant={variant}>
            {subMessage}
          </StyledAlertDialogSubMessage>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {okayTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
