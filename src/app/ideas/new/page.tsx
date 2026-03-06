"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIdeas } from "@/hooks/useIdeas";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { toast } from "sonner";
import type { IdeaFormData } from "@/lib/types/database.types";

export default function NewIdeaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createIdea } = useIdeas();

  const handleSubmit = async (data: IdeaFormData) => {
    if (!user) {
      toast.error("Please sign in");
      return { error: new Error("Not authenticated") };
    }

    const { idea, error } = await createIdea(data, user.id);

    if (!error && idea) {
      toast.success("Idea created successfully!");
      router.push(`/ideas/${idea.id}`);
    }

    return { error };
  };

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
