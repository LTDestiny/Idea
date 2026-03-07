"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_LABELS,
  type IdeaCategory,
  type IdeaFormData,
} from "@/lib/types/database.types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface IdeaFormProps {
  initialData?: IdeaFormData;
  onSubmit: (data: IdeaFormData) => Promise<{ error: unknown }>;
  submitLabel: string;
}

export function IdeaForm({
  initialData,
  onSubmit,
  submitLabel,
}: IdeaFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState<IdeaCategory | "">(
    initialData?.category || "",
  );
  const [lookingFor, setLookingFor] = useState(initialData?.looking_for || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!category) {
      toast.error("Please select a category(ies)");
      return;
    }

    setLoading(true);
    const { error } = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category as IdeaCategory,
      looking_for: lookingFor.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-2xl mx-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 200))}
          placeholder="Enter your idea title..."
          required
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground text-right">
          {title.length}/200
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
          placeholder="Describe your idea..."
          required
          maxLength={5000}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground text-right">
          {description.length}/5000
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          Categories <span className="text-destructive">*</span>
        </Label>
        <Select
          value={category}
          onValueChange={(val) => setCategory(val as IdeaCategory)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category(ies)" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(CATEGORY_LABELS) as [IdeaCategory, string][]).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="looking-for">Who are you looking for? (Optional)</Label>
        <Textarea
          id="looking-for"
          value={lookingFor}
          onChange={(e) => setLookingFor(e.target.value.slice(0, 500))}
          placeholder="e.g. Someone with knowledge in biology, a UI/UX designer, a marketing expert..."
          maxLength={500}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground text-right">
          {lookingFor.length}/500
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
