"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/lib/types/database.types";

function buildCommentTree(flatComments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  // Initialize all comments with empty replies
  for (const comment of flatComments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  // Build tree
  for (const comment of flatComments) {
    const node = map.get(comment.id)!;
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function useComments(ideaId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles!user_id(*)")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data as Comment[]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (content: string, userId: string, parentId?: string) => {
      const insertData: {
        idea_id: string;
        user_id: string;
        content: string;
        parent_id?: string;
      } = {
        idea_id: ideaId,
        user_id: userId,
        content,
      };

      if (parentId) {
        insertData.parent_id = parentId;
      }

      const { data, error } = await supabase
        .from("comments")
        .insert(insertData)
        .select("*, profiles!user_id(*)")
        .single();

      if (!error && data) {
        setComments((prev) => [...prev, data as Comment]);
      }

      return { data, error };
    },
    [ideaId, supabase],
  );

  // Memoize tree-structured comments
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
  const totalCount = comments.length;

  return {
    comments: commentTree,
    totalCount,
    loading,
    addComment,
    refresh: fetchComments,
  };
}
