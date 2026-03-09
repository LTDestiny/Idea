"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "sonner";

interface ImageUploadProps {
  /** Currently stored image URLs */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Maximum number of images (default 5) */
  max?: number;
}

export function ImageUpload({ value, onChange, max = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remaining = max - value.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} image${max > 1 ? "s" : ""} allowed`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 20 MB limit`);
        continue;
      }
      try {
        const url = await uploadImage(file);
        uploaded.push(url);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {/* Previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group w-24 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded image ${i + 1}`}
                className="w-full h-full object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < max && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={max > 1}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Add Image"}
          </Button>
        </>
      )}
    </div>
  );
}
