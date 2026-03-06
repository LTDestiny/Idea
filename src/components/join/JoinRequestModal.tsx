"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { JoinRequestFormData } from "@/lib/types/database.types";

interface JoinRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JoinRequestFormData) => Promise<{ error: unknown }>;
  ideaTitle: string;
}

export function JoinRequestModal({
  open,
  onClose,
  onSubmit,
  ideaTitle,
}: JoinRequestModalProps) {
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await onSubmit({
      message: message.trim(),
      relevant_skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    setLoading(false);

    if (error) {
      toast.error("Could not submit request. Please try again.");
    } else {
      toast.success("Join request submitted!");
      setMessage("");
      setSkills("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request to Join Idea</DialogTitle>
          <DialogDescription>&quot;{ideaTitle}&quot;</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-message">
              Why do you want to join? (optional)
            </Label>
            <Textarea
              id="join-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Share why you want to join..."
              maxLength={500}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="join-skills">
              Skills you can contribute (optional)
            </Label>
            <Textarea
              id="join-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value.slice(0, 300))}
              placeholder="e.g. Biology, Data Analysis, Python..."
              maxLength={300}
              className="min-h-[60px]"
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with commas
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
