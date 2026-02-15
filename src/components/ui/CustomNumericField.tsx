import { Asterisk } from "lucide-react";
import { useMemo } from "react";
import { FieldError, Input, Label, NumberField } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export function CustomNumericField({
  label,
  units,
  inputProps,
  numberFieldProps,
  isVisualRequired,
  errorMessage,
}: {
  label: string;
  units?: string;
  inputProps?: React.ComponentProps<typeof Input>;
  numberFieldProps?: React.ComponentProps<typeof NumberField>;
  isVisualRequired?: boolean;
  errorMessage?: string;
}) {
  const isRequired =
    inputProps?.required || numberFieldProps?.isRequired || isVisualRequired;

  const inputClass = useMemo(
    () =>
      cls(
        "peer w-full px-2 pb-1 pt-3 border border-white/10 rounded-sm placeholder:text-sm bg-white/10",
        "focus:outline-0 focus:border focus:border-white group-invalid:border-error",
        units ? "pr-14" : null,
        inputProps?.className?.toString(),
      ),
    [inputProps?.className, units],
  );

  return (
    <NumberField {...numberFieldProps} className="group w-full">
      <fieldset
        className={cls(
          "relative flex items-center w-full",
          numberFieldProps?.className?.toString(),
        )}
      >
        <Input {...inputProps} className={inputClass} />

        <Label
          className={cls(
            "absolute top-0.5 left-1 inline-flex px-1 text-xxs text-current/50",
            "peer-focus:text-white group-focused:text-white group-invalid:text-error",
          )}
        >
          {label}
          {isRequired && <Asterisk className="text-red-500" size={10} />}
        </Label>
        {units && (
          <div className="absolute flex items-center right-0 inset-y-0 pr-4 pl-1 text-xs font-medium text-center pointer-events-none">
            {units}
          </div>
        )}
      </fieldset>
      <FieldError className="text-error text-xs mt-1">
        {errorMessage}
      </FieldError>
    </NumberField>
  );
}
