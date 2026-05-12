import type { TextFieldProps } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export type AppPasswordInputProps = Omit<TextFieldProps, "type" | "InputProps">;

type InputSlotProps = NonNullable<
  NonNullable<AppPasswordInputProps["slotProps"]>["input"]
>;

type InputSlotPropsResolver = Extract<
  InputSlotProps,
  (...args: never[]) => unknown
>;
type InputSlotOwnerState = Parameters<InputSlotPropsResolver>[0];
type ResolvedInputSlotProps = ReturnType<InputSlotPropsResolver>;

export function AppPasswordInput({
  slotProps,
  ...props
}: AppPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputSlotProps = slotProps?.input;

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const renderEndAdornment = (endAdornment?: ReactNode) => (
    <>
      {endAdornment}
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? "Hide password" : "Show password"}
          edge="end"
          onClick={handleToggleVisibility}
          onMouseDown={handleMouseDown}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    </>
  );

  const composeInputSlotProps = (
    currentInputSlotProps?: ResolvedInputSlotProps,
  ): ResolvedInputSlotProps => ({
    ...currentInputSlotProps,
    endAdornment: renderEndAdornment(currentInputSlotProps?.endAdornment),
  });

  const composedInputSlotProps =
    typeof inputSlotProps === "function"
      ? (ownerState: InputSlotOwnerState) =>
          composeInputSlotProps(inputSlotProps(ownerState))
      : composeInputSlotProps(inputSlotProps);

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      slotProps={{
        ...slotProps,
        input: composedInputSlotProps,
      }}
    />
  );
}
