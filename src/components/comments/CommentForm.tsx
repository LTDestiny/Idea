"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<{ error: unknown }>;
  placeholder?: string;
  compact?: boolean;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
  compact = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const { error } = await onSubmit(content.trim());
    setLoading(false);

    if (error) {
      toast.error("Could not post comment");
    } else {
      setContent("");
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
        required
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || !content.trim()}
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
    </form>
  );
}
