import { useRef } from "react";
import { SpinnerIcon, UploadCloudIcon, ImagePlusIcon } from "./icons";
import { useUploadStore } from "../store/uploadStore";

type UploadCardProps = {
  dragActive: boolean;
  errorMessage: string;
  isUploading: boolean;
  onDragChange: (active: boolean) => void;
  onFileSelected: (file: File | null, mealType: string) => void;
};

export const UploadCard = ({
  dragActive,
  errorMessage,
  isUploading,
  onDragChange,
  onFileSelected,
}: UploadCardProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progressMessage = useUploadStore((state) => state.progressMessage);

  const handleFile = (file: File | null) => {
    onFileSelected(file, "auto");
  };

  return (
    <section
      className={`relative w-full max-w-2xl mx-auto rounded-[24px] border border-border bg-white px-8 py-16 flex flex-col items-center justify-center transition-colors ${
        dragActive ? "border-primary bg-primaryBg" : "hover:border-[#7A9E7E] hover:bg-[#F5F6F1]"
      }`}
      onDragEnter={(event) => { event.preventDefault(); onDragChange(true); }}
      onDragOver={(event)  => { event.preventDefault(); onDragChange(true); }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        onDragChange(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDragChange(false);
        handleFile(event.dataTransfer.files[0] ?? null);
      }}
    >
      <input
        ref={inputRef}
        accept=".jpg,.jpeg,.png,image/png,image/jpeg"
        className="hidden"
        type="file"
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? null);
          event.currentTarget.value = "";
        }}
      />

      <div className="w-16 h-16 rounded-full bg-[#F5F6F1] border border-border flex items-center justify-center mb-6">
        <UploadCloudIcon className="h-8 w-8 text-[#7A9E7E]" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-textHeading mb-2">
        Drag &amp; drop your food image here
      </h2>
      <p className="text-sm text-textMuted mb-8">or click to browse files</p>

      <button
        className="w-full max-w-sm px-6 py-3.5 rounded-xl bg-[#9DB89F] hover:bg-[#7A9E7E] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm mb-6"
        disabled={isUploading}
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <SpinnerIcon className="h-5 w-5 animate-spin text-white" />
        ) : (
          <ImagePlusIcon className="h-5 w-5 text-white" />
        )}
        {isUploading ? progressMessage || "Uploading..." : "Choose Image"}
      </button>

      <p className="text-xs font-semibold text-textMuted">
        Supports JPG, JPEG, PNG • Max size: 10MB
      </p>

      {errorMessage && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm rounded-lg border border-danger/50 bg-danger/10 px-4 py-3 text-sm font-medium text-danger text-center">
          {errorMessage}
        </div>
      )}
    </section>
  );
};

