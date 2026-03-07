import { IdeaList } from "@/components/ideas/IdeaList";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { IdeaWithDetails } from "@/lib/types/database.types";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("ideas")
    .select(
      `
      *,
      profiles!creator_id(*),
      comments(count),
      join_requests(count)
    `,
    )
    .order("created_at", { ascending: false });

  const ideas = (data ?? []) as IdeaWithDetails[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore GLOCAL STEAM Ideas</h1>
        <p className="text-muted-foreground mt-2">
          Share, connect, and develop ideas with the community
        </p>
      </div>
      <IdeaList initialData={ideas} />
    </div>
  );
}
