"use client";

import { CircleCheck, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  Label,
} from "react-aria-components";
import { toast } from "sonner";
import defaultTheme from "tailwindcss/defaultTheme";
import { useIsMounted, useMediaQuery } from "usehooks-ts";
import { DropDownIcon } from "@/components/common/DropIcons";
import { CustomCountrySelect } from "@/components/ui/CustomCountrySelect";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useKyc } from "@/features/user/hooks/useKyc";
import { cls } from "@/utils/general.utils";
import type { FileUploadState } from "../../types";
import FileInput from "./FileInput";

export default function VerificationSettings() {
  const locale = "en";

  const [isExpanded, setIsExpanded] = useState(true);

  const isMounted = useIsMounted();
  const matches = useMediaQuery(`(max-width: ${defaultTheme.screens.lg})`);

  const [documents, setDocuments] = useState<{
    front: FileUploadState | null;
    back: FileUploadState | null;
    selfie: FileUploadState | null;
  }>({
    front: null,
    back: null,
    selfie: null,
  });

  const isMobile = isMounted() && matches;
  const stateExpanded = isMobile ? isExpanded : true;

  const { kyc, submitKyc } = useKyc();
  const [docType, setDocType] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusLabel = useMemo(() => {
    if (!kyc) return null;
    if (kyc.status === "PENDING") return "Pending review";
    if (kyc.status === "APPROVED") return "Approved";
    return "Rejected";
  }, [kyc]);

  const isReadonly = kyc?.status === "PENDING" || kyc?.status === "APPROVED";

  useEffect(() => {
    if (!kyc) return;
    setDocType(kyc.docType);
    setCountry(kyc.country);
  }, [kyc]);

  const handleSubmit = async () => {
    if (isSubmitting || isReadonly) return;
    if (!docType || !country) {
      toast.error("Document type and country are required");
      return;
    }
    if (!documents.front?.file || !documents.selfie?.file) {
      toast.error("Front side and selfie are required");
      return;
    }

    const form = new FormData();
    form.append("docType", docType);
    form.append("country", country);
    form.append("front", documents.front.file);
    if (documents.back?.file) form.append("back", documents.back.file);
    form.append("selfie", documents.selfie.file);

    setIsSubmitting(true);
    const res = await submitKyc(form);
    setIsSubmitting(false);

    if (!res) {
      toast.error("Failed to submit KYC");
      return;
    }

    toast.success("KYC submitted");
  };

  return (
    <Disclosure isExpanded={stateExpanded}>
      <Heading>
        <Label
          className={cls(
            "flex items-center justify-between p-2 m-2 rounded-xs",
            "max-lg:hover:bg-neutral-900 max-lg:cursor-pointer",
          )}
        >
          <div className="flex gap-2 items-center">
            <ShieldCheck size={20} />
            <p className="font-semibold text-xl">Verification</p>
          </div>
          {isMobile && (
            <Button
              className={cls({ "rotate-180": stateExpanded })}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <DropDownIcon />
            </Button>
          )}
        </Label>
      </Heading>
      <DisclosurePanel>
        <div className="flex flex-col gap-4 p-4">
          <p className="text-sm">Details</p>
          {statusLabel ? (
            <div className="rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
              Status: <span className="font-semibold">{statusLabel}</span>
              {kyc?.status === "REJECTED" && kyc.rejectReason ? (
                <span className="ml-2 text-red-400">{kyc.rejectReason}</span>
              ) : null}
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
            <CustomTextField
              textFieldProps={{ isDisabled: isReadonly }}
              inputProps={{
                placeholder: "Passport",
                required: true,
                value: docType,
                onChange: (event) => setDocType(event.target.value),
              }}
              label="Document type"
            />
            <CustomCountrySelect
              placeholder="Select country"
              locale={locale}
              label="Issuing country"
              isVisualRequired
              value={country}
              onChange={(value) => setCountry(value)}
            />
          </div>

          <p className="text-sm">Attachments</p>
          <FileInput
            text="Upload front side of document"
            file={documents.front}
            setFile={(file) => {
              setDocuments((prev) => ({ ...prev, front: file }));
            }}
          />
          <FileInput
            text="Upload back side of document"
            file={documents.back}
            setFile={(file) =>
              setDocuments((prev) => ({ ...prev, back: file }))
            }
          />
          <FileInput
            text="Upload selfie with document"
            file={documents.selfie}
            setFile={(file) =>
              setDocuments((prev) => ({ ...prev, selfie: file }))
            }
          />
          <div>
            <Button
              className="flex items-center justify-center gap-3 pl-3 pr-5 py-3 text-sm rounded-md text-white cursor-pointer bg-neutral-900 disabled:opacity-40"
              isDisabled={isSubmitting || isReadonly}
              onPress={handleSubmit}
            >
              <CircleCheck size={14} />
              {isSubmitting ? "Sending..." : "Send documents"}
            </Button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
