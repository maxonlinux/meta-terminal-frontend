import Decimal from "decimal.js";
import { Paperclip, Trash2 } from "lucide-react";
import { type ChangeEvent, useId, useRef } from "react";
import { Button } from "react-aria-components";
import FilePreview from "./FilePreview";
import type { FileUploadState } from "../../types";

const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

export default function FileInput({
  text,
  file,
  setFile,
}: {
  text: string;
  file: FileUploadState | null;
  setFile: (file: FileUploadState | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: FileUploadState | null) => void,
  ) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (!allowedFileTypes.includes(file.type)) {
      //   return addToast(
      //     t("tabPanels.verificationTab.fileTypes"),
      //     ToastStatus.Error
      //   );

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10 MB
      //   return addToast(
      //     t("tabPanels.verificationTab.fileSizeWarning"),
      //     ToastStatus.Error
      //   );

      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setFile({
      file: file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    });
  };

  return (
    <div className="relative flex items-center justify-center w-full overflow-hidden rounded-sm border border-border">
      {file ? (
        <div className="flex max-h-20 gap-2 w-full group">
          <Button
            className="absolute z-10 hidden group-hover:flex inset-0 items-center justify-center cursor-pointer"
            onClick={() => setFile(null)}
          >
            <Trash2 className="text-red-400" />
          </Button>
          <FilePreview file={file} />
          <div className="absolute inset-0 flex items-center justify-center group-hover:hidden">
            <span className="bg-black bg-opacity-50 text-white p-2 rounded text-xs">
              File Size{" "}
              {new Decimal(file.size)
                .div(1024)
                .div(1024)
                .toDecimalPlaces(2, Decimal.ROUND_DOWN)
                .toString()}{" "}
              MB
            </span>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          aria-label={text}
          className="flex flex-col justify-center w-full min-h-20 cursor-pointer"
        >
          <div className="flex items-center gap-4 px-4 text-white/50">
            <div className="flex items-center justify-center size-10 rounded-full shrink-0 border-2 border-white/10">
              <Paperclip size={18} />
            </div>
            <div className="flex flex-col justify-center py-2">
              <p className="mb-2 text-sm">
                <span className="font-semibold">{text}</span>
              </p>
              <p className="text-xs">PDF, JPG, JPEG, PNG (MAX. 10MB)</p>
            </div>
          </div>
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf, image/jpeg, image/jpg, image/png"
            onChange={(e) => handleFileInputChange(e, setFile)}
          />
        </label>
      )}
    </div>
  );
}
