import { CheckCircle, Loader } from "lucide-react";
import { Button } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export const SubmitButton = ({
  isSubmitting,
  isDirty,
  label,
}: {
  isSubmitting: boolean;
  isDirty: boolean;
  label?: string;
}) => (
  <Button
    type="submit"
    isDisabled={isSubmitting || !isDirty}
    aria-label="Submit button"
    className={cls(
      "flex items-center justify-center gap-3 pl-3 pr-5 py-3 text-sm rounded-md text-white cursor-pointer bg-neutral-900",
      "disabled:opacity-50",
    )}
  >
    {isSubmitting ? (
      <Loader size={14} className="inline animate-spin" />
    ) : (
      <CheckCircle size={14} />
    )}
    {label}
  </Button>
);
