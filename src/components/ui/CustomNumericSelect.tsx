import {
  Button,
  FieldError,
  Input,
  Label,
  NumberField,
} from "react-aria-components";
import { cls } from "@/utils/general.utils";

export function CustomNumericSelect({
  label,
  inputProps,
  numberFieldProps,
  isVisualRequired,
  errorMessage,
}: {
  label: string;
  inputProps?: React.ComponentProps<typeof Input>;
  numberFieldProps?: React.ComponentProps<typeof NumberField>;
  isVisualRequired?: boolean;
  errorMessage?: string;
}) {
  const isRequired =
    inputProps?.required || numberFieldProps?.isRequired || isVisualRequired;

  return (
    <NumberField
      {...numberFieldProps}
      className={cls(
        "group pt-2 w-full",
        numberFieldProps?.className?.toString(),
      )}
    >
      <fieldset className="relative w-full flex border border-white/10 rounded-sm focus:border focus-within:border-white group-invalid:border-error">
        <Button className="px-2" slot="decrement">
          -
        </Button>
        <Input
          {...inputProps}
          className={cls(
            "peer w-full p-2",
            "focus:outline-0",
            inputProps?.className?.toString(),
          )}
        />
        <Button className="px-2" slot="increment">
          +
        </Button>
        <Label
          className={cls(
            "absolute -top-2.5 left-2 inline-block px-1 text-xs text-current/50 bg-background",
            "peer-focus:text-white group-focused:text-white group-invalid:text-error",
          )}
        >
          {label}{" "}
          {isRequired && <span className="text-sm text-red-500">*</span>}
        </Label>
      </fieldset>
      <FieldError className="text-error text-xs mt-1">
        {errorMessage}
      </FieldError>
    </NumberField>
  );
}
