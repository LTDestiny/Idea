"use client";

import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "sonner";

interface CommentFormProps {
  onSubmit: (content: string, imageUrl?: string) => Promise<{ error: unknown }>;
  placeholder?: string;
  compact?: boolean;
  onCancel?: () => void;
  mentionName?: string;
}

export function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
  compact = false,
  onCancel,
  mentionName,
}: CommentFormProps) {
  const prefix = mentionName ? `@[${mentionName}] ` : "";
  const [content, setContent] = useState(prefix);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image exceeds the 20 MB limit");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    setLoading(true);
    const { error } = await onSubmit(content.trim(), imageUrl ?? undefined);
    setLoading(false);

    if (error) {
      toast.error("Could not post comment");
    } else {
      setContent("");
      setImageUrl(null);
      toast.success("Comment posted");
      onCancel?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 1000))}
        placeholder={placeholder}
        className={compact ? "min-h-[60px] text-sm" : "min-h-[80px]"}
        maxLength={1000}
      />

      {/* Image preview */}
      {imageUrl && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Attached"
            className="max-h-32 rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center gap-2">
        {/* Image attach */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
          {!imageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5 text-muted-foreground"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : ""}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || uploading || (!content.trim() && !imageUrl)}
            size="sm"
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {compact ? "Reply" : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}

