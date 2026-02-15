"use client";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ru from "i18n-iso-countries/langs/ru.json";
import { Asterisk, ChevronDown } from "lucide-react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { cls } from "@/utils/general.utils";

countries.registerLocale(en);
countries.registerLocale(ru);

function getLocalizedCountries({
  locale = "en",
  exclude = [],
}: {
  locale?: string;
  exclude?: string[];
}) {
  const names = countries.getNames(locale, { select: "official" });

  return Object.entries(names)
    .filter(([code]) => !exclude.includes(code))
    .map(([code, name]) => ({
      code,
      name,
      key: code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

interface CountrySelectProps {
  value?: string;
  onChange?: (code: string) => void;
  isVisualRequired?: boolean;
  locale?: string;
  exclude?: string[];
  placeholder?: string;
  label?: string;
}

export function CustomCountrySelect({
  value,
  onChange,
  locale,
  exclude,
  placeholder,
  isVisualRequired,
  label,
}: CountrySelectProps) {
  const countries = getLocalizedCountries({ locale, exclude });

  const isRequired = isVisualRequired;

  return (
    <ComboBox
      selectedKey={value}
      onSelectionChange={(key) => {
        if (typeof key === "string") onChange?.(key);
      }}
      className="text-current/50"
      aria-label={label}
    >
      <div className="relative group flex items-center border border-white/10 rounded-sm overflow-hidden bg-white/10 w-full focus-within:border-white">
        <Label
          className={cls(
            "absolute top-0.5 left-1 inline-flex px-1 text-xxs",
            "peer-focus:text-white group-focused:text-white group-invalid:text-error",
          )}
        >
          {label}
          {isRequired && <Asterisk className="text-red-500" size={10} />}
        </Label>
        <Input
          className={cls(
            "flex-1 text-white placeholder:text-muted-fg placeholder:text-sm outline-none px-2 pb-1 pt-3",
          )}
          placeholder={placeholder}
        />
        <Button className="text-white p-2">
          <ChevronDown
            className="transition-transform group-pressed:rotate-180"
            size={12}
          />
        </Button>
      </div>

      <Popover className="bg-neutral-800 w-(--trigger-width) border border-white/10 rounded-sm shadow-md shadow-black/50 overflow-auto z-50">
        <ListBox items={countries} className="w-full max-h-60">
          {(item) => (
            <ListBoxItem
              key={item.code}
              id={item.code}
              className="py-2 px-2 text-sm focus:bg-neutral-700 cursor-pointer truncate"
            >
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
