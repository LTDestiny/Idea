"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  IdeaWithDetails,
  IdeaCategory,
  IdeaFormData,
} from "@/lib/types/database.types";

type SortOption = "newest" | "most_comments" | "most_interest";

function sortIdeas(
  data: IdeaWithDetails[],
  sort: SortOption,
): IdeaWithDetails[] {
  if (sort === "newest") return data;
  const sorted = [...data];
  if (sort === "most_comments") {
    sorted.sort(
      (a, b) => (b.comments[0]?.count || 0) - (a.comments[0]?.count || 0),
    );
  } else if (sort === "most_interest") {
    sorted.sort(
      (a, b) =>
        (b.join_requests[0]?.count || 0) - (a.join_requests[0]?.count || 0),
    );
  }
  return sorted;
}

export function useIdeas(initialData?: IdeaWithDetails[]) {
  const [ideas, setIdeas] = useState<IdeaWithDetails[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [category, setCategory] = useState<IdeaCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const supabase = useMemo(() => createClient(), []);
  // Track whether SSR data can still be used (StrictMode-safe: only mutated true→false)
  const canSkipFetch = useRef(!!initialData);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);

    let query = supabase.from("ideas").select(`
        *,
        profiles!creator_id(*),
        comments(count),
        join_requests(count)
      `);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching ideas:", error);
      setIdeas([]);
    } else {
      setIdeas(data as IdeaWithDetails[]);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  // Skip fetch when SSR data is still valid for default filters
  useEffect(() => {
    if (canSkipFetch.current && category === "all" && !search) {
      return;
    }
    canSkipFetch.current = false;
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchIdeas]);

  // Client-side sort — no refetch needed
  const sortedIdeas = useMemo(() => sortIdeas(ideas, sort), [ideas, sort]);

  const createIdea = useCallback(
    async (data: IdeaFormData, creatorId: string) => {
      const { data: idea, error } = await supabase
        .from("ideas")
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          looking_for: data.looking_for || null,
          creator_id: creatorId,
        })
        .select()
        .single();

      return { idea, error };
    },
    [supabase],
  );

  const updateIdea = useCallback(
    async (id: string, data: IdeaFormData) => {
      const { data: idea, error } = await supabase
        .from("ideas")
        .update({
          title: data.title,
          description: data.description,
          category: data.category,
          looking_for: data.looking_for || null,
        })
        .eq("id", id)
        .select()
        .single();

      return { idea, error };
    },
    [supabase],
  );

  const deleteIdea = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("ideas").delete().eq("id", id);
      return { error };
    },
    [supabase],
  );

  return {
    ideas: sortedIdeas,
    loading,
    category,
    setCategory,
    search,
    setSearch,
    sort,
    setSort,
    refresh: fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
  };
}
