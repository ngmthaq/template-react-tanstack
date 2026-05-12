import { Alert, styled } from "@mui/material";

export const StyledNotificationAlert = styled(Alert)(({ theme }) => ({
  width: "100%",
  boxShadow: theme.shadows[3],
}));
