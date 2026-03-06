"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { toast } from "sonner";
import type { IdeaFormData } from "@/lib/types/database.types";

export default function NewIdeaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const handleSubmit = useCallback(
    async (data: IdeaFormData) => {
      if (!user) {
        toast.error("Please sign in");
        return { error: new Error("Not authenticated") };
      }

      const { data: idea, error } = await supabase
        .from("ideas")
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          looking_for: data.looking_for || null,
          creator_id: user.id,
        })
        .select()
        .single();

      if (!error && idea) {
        toast.success("Idea created successfully!");
        router.push(`/ideas/${idea.id}`);
      }

      return { error };
    },
    [user, supabase, router],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Idea</h1>
        <p className="text-muted-foreground mt-1">
          Share your idea with the community
        </p>
      </div>
      <IdeaForm onSubmit={handleSubmit} submitLabel="Post Idea" />
    </div>
  );
}
