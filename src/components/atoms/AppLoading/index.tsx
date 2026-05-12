import { CircularProgress } from "@mui/material";
import { Backdrop } from "./styled";

export interface AppLoadingProps {
  open?: boolean;
}

export function AppLoading({ open = true }: AppLoadingProps) {
  return (
    <Backdrop $open={open}>
      <CircularProgress />
    </Backdrop>
  );
}
