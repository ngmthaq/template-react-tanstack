import { styled } from "@mui/material";

export const Backdrop = styled("div", {
  shouldForwardProp: (prop) => prop !== "$open",
})<{ $open: boolean }>(({ $open }) => ({
  display: $open ? "flex" : "none",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
}));
