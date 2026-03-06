"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  JoinRequest,
  JoinRequestFormData,
} from "@/lib/types/database.types";

export function useJoinRequests(ideaId: string, userId?: string) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  // Derive userRequest from the already-fetched requests array — no extra API call
  const userRequest = useMemo(() => {
    if (!userId) return null;
    return requests.find((r) => r.requester_id === userId) ?? null;
  }, [requests, userId]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("join_requests")
      .select("*, profiles!requester_id(*)")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching join requests:", error);
    } else {
      setRequests(data as JoinRequest[]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  // Fetch on mount and when ideaId changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Realtime subscription: re-fetch when join_requests for this idea change
  useEffect(() => {
    const channel = supabase
      .channel(`join_requests:idea_id=eq.${ideaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "join_requests",
          filter: `idea_id=eq.${ideaId}`,
        },
        () => {
          fetchRequests();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId, fetchRequests]);

  const createRequest = useCallback(
    async (formData: JoinRequestFormData, requesterId: string) => {
      const { data, error } = await supabase
        .from("join_requests")
        .insert({
          idea_id: ideaId,
          requester_id: requesterId,
          message: formData.message || null,
          relevant_skills: formData.relevant_skills,
        })
        .select("*, profiles!requester_id(*)")
        .single();

      if (!error && data) {
        setRequests((prev) => [data as JoinRequest, ...prev]);
      }

      return { data, error };
    },
    [ideaId, supabase],
  );

  const updateRequestStatus = useCallback(
    async (requestId: string, status: "approved" | "rejected") => {
      const { error } = await supabase
        .from("join_requests")
        .update({ status })
        .eq("id", requestId);

      if (!error) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
        );
      }

      return { error };
    },
    [supabase],
  );

  return {
    requests,
    userRequest,
    loading,
    createRequest,
    updateRequestStatus,
    refresh: fetchRequests,
  };
}
