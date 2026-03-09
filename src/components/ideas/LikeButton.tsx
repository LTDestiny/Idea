"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LikeButtonProps {
  ideaId: string;
  initialCount: number;
  size?: "sm" | "md";
}

export function LikeButton({ ideaId, initialCount, size = "sm" }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Check if the current user has liked this idea
  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }
    supabase
      .from("idea_likes")
      .select("id")
      .eq("idea_id", ideaId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [user, ideaId, supabase]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user || loading) return;
      setLoading(true);

      if (liked) {
        const { error } = await supabase
          .from("idea_likes")
          .delete()
          .eq("idea_id", ideaId)
          .eq("user_id", user.id);
        if (!error) {
          setLiked(false);
          setCount((c) => Math.max(0, c - 1));
        }
      } else {
        const { error } = await supabase
          .from("idea_likes")
          .insert({ idea_id: ideaId, user_id: user.id });
        if (!error) {
          setLiked(true);
          setCount((c) => c + 1);
        }
      }
      setLoading(false);
    },
    [user, loading, liked, supabase, ideaId],
  );

  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const textClass = size === "md" ? "text-sm font-medium" : "text-xs";

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !user}
      title={user ? (liked ? "Unlike" : "Like") : "Sign in to like"}
      className={`flex items-center gap-1 transition-colors disabled:cursor-default ${
        liked
          ? "text-rose-500"
          : user
            ? "text-muted-foreground hover:text-rose-500"
            : "text-muted-foreground/50"
      }`}
    >
      <Heart className={`${iconClass} ${liked ? "fill-current" : ""} transition-all`} />
      <span className={textClass}>{count}</span>
    </button>
  );
}
