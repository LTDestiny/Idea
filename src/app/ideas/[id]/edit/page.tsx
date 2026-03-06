"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Idea, IdeaFormData } from "@/lib/types/database.types";

export default function EditIdeaPage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchIdea = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", ideaId)
        .single();

      if (error || !data) {
        toast.error("Idea not found");
        router.push("/");
        return;
      }

      setIdea(data as Idea);
      setLoading(false);
    };

    fetchIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  // Redirect if not owner
  useEffect(() => {
    if (!authLoading && !loading && idea && user) {
      if (user.id !== idea.creator_id) {
        toast.error("You do not have permission to edit this idea");
        router.push(`/ideas/${ideaId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, loading, idea, user]);

  const isOwner =
    !authLoading && !loading && idea && user && user.id === idea.creator_id;

  const handleSubmit = useCallback(
    async (data: IdeaFormData) => {
      const { error } = await supabase
        .from("ideas")
        .update({
          title: data.title,
          description: data.description,
          category: data.category,
          looking_for: data.looking_for || null,
        })
        .eq("id", ideaId);

      if (!error) {
        toast.success("Idea updated!");
        router.push(`/ideas/${ideaId}`);
      }

      return { error };
    },
    [supabase, ideaId, router],
  );

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!idea || !isOwner) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Idea</h1>
        <p className="text-muted-foreground mt-1">Update your idea details</p>
      </div>
      <IdeaForm
        initialData={{
          title: idea.title,
          description: idea.description,
          category: idea.category,
          looking_for: idea.looking_for || "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
