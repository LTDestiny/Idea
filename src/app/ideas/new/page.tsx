"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { IdeaFormData } from "@/lib/types/database.types";

export default function NewIdeaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
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
          zalo_link: data.zalo_link || null,
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

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

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
