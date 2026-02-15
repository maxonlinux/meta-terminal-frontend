import { Asterisk } from "lucide-react";
import { FieldError, Label, TextArea, TextField } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export function CustomTextArea({
  label,
  textFieldProps,
  textAreaProps,
  isVisualRequired,
  errorMessage,
}: {
  label: string;
  textFieldProps?: React.ComponentProps<typeof TextField>;
  textAreaProps?: React.ComponentProps<typeof TextArea>;
  isVisualRequired?: boolean;
  errorMessage?: string;
}) {
  const isRequired =
    textFieldProps?.isRequired || textAreaProps?.required || isVisualRequired;

  return (
    <TextField {...textFieldProps} className="group pt-2 w-full">
      <fieldset className="relative flex flex-col justify-center w-full">
        <TextArea
          {...textAreaProps}
          className={cls(
            "peer w-full px-2 pb-1 pt-4 border border-white/10 rounded-sm placeholder:text-sm bg-white/10",
            "focus:outline-0 focus:border focus:border-white group-invalid:border-error",
            textAreaProps?.className?.toString(),
          )}
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
