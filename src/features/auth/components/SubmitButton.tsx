import { ArrowRight, Loader } from "lucide-react";
import { Button } from "react-aria-components";

export const SubmitButton = ({
  isSubmitting,
  label,
}: {
  isSubmitting: boolean;
  label: string;
}) => (
  <Button
    type="submit"
    isDisabled={isSubmitting}
    aria-label="Submit button"
    className="flex items-center gap-2 px-4 py-2 hover:brightness-125 transition-all rounded-sm w-full bg-accent border border-white/20 text-white disabled:opacity-50 cursor-pointer"
  >
    {isSubmitting && <Loader size={14} className="inline animate-spin" />}
    {label}
    <ArrowRight size={14} className="ml-auto" />
  </Button>
);
