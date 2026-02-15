import type { FormatFunction, ParseFunction } from "input-format";
import Input from "input-format/react";
import { AsYouType } from "libphonenumber-js";
import { Asterisk } from "lucide-react";
import { Group, Label } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export function CustomPhoneField({
  label,
  isVisualRequired,
  errorMessage,
  isInvalid,
  ...rest
}: {
  label: string;
  isVisualRequired?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "format" | "parse">) {
  const isRequired = rest.required || isVisualRequired;

  const parse: ParseFunction = (character: string, value: string) => {
    if (character === "+" && value.length === 0) return "+";
    return /\d/.test(character) ? character : undefined;
  };

  const format: FormatFunction = (value?: string) => {
    if (!value) return { text: "", template: "" };

    const asYouType = new AsYouType();
    const text = asYouType.input(value);
    const template = asYouType.getTemplate();

    return { text, template };
  };

  return (
    <Group isInvalid={isInvalid} className="group pt-2 w-full">
      <fieldset className="relative flex items-center w-full">
        <Input
          parse={parse}
          format={format}
          {...rest}
          className={cls(
            "peer w-full px-2 pb-1 pt-3 border border-white/10 rounded-sm placeholder:text-sm bg-white/10",
            "focus:outline-0 focus:border focus:border-white group-invalid:border-error",
            rest.className?.toString(),
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
      <p className="text-error text-xs mt-1">{errorMessage}</p>
    </Group>
  );
}
