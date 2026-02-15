import { Asterisk } from "lucide-react";
import { useMemo } from "react";
import { FieldError, Input, Label, TextField } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export function CustomTextField({
  label,
  textFieldProps,
  inputProps,
  isVisualRequired,
  errorMessage,
  icon,
}: {
  label: string;
  textFieldProps?: React.ComponentProps<typeof TextField>;
  inputProps?: React.ComponentProps<typeof Input>;
  isVisualRequired?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
}) {
  const isRequired =
    textFieldProps?.isRequired || inputProps?.required || isVisualRequired;

  const paddingLeft = useMemo(() => (icon ? "36px" : "8px"), [icon]);

  return (
    <TextField
      {...textFieldProps}
      className={cls("group w-full", textFieldProps?.className?.toString())}
    >
      <fieldset className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-0 top-1 h-full w-8 flex items-center justify-center">
            {icon}
          </div>
        )}
        <Input
          {...inputProps}
          className={cls(
            "peer w-full px-2 pb-1 pt-3 border border-white/10 rounded-sm placeholder:text-sm bg-white/10",
            "focus:outline-0 focus:border focus:border-white group-invalid:border-error",
            inputProps?.className?.toString(),
          )}
          style={{
            paddingLeft,
          }}
        />

        <Label
          className={cls(
            "absolute top-0.5 left-1 inline-flex px-1 text-xxs text-current/50",
            "peer-focus:text-white group-focused:text-white group-invalid:text-error",
          )}
        >
          {label}
          {isRequired && <Asterisk className="text-red-500" size={10} />}
        </Label>
      </fieldset>
      <FieldError className="text-error text-xs mt-1">
        {errorMessage}
      </FieldError>
    </TextField>
  );
}
