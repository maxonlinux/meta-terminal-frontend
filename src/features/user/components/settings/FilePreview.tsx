import Image from "next/image";
import type { FileUploadState } from "./types";

export default function FilePreview({ file }: { file: FileUploadState }) {
  return file.file.type.startsWith("image/") ? (
    <div className="relative size-full">
      <Image
        src={file.previewUrl as string}
        alt="Preview"
        fill
        unoptimized
        className="object-cover blur-sm"
      />
    </div>
  ) : (
    <iframe
      src={file.previewUrl as string}
      title="File Preview"
      className="size-full object-cover blur-sm"
    />
  );
}
