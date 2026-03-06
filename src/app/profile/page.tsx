"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Lightbulb, Users } from "lucide-react";
import type { IdeaWithDetails } from "@/lib/types/database.types";

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [myIdeas, setMyIdeas] = useState<IdeaWithDetails[]>([]);
  const [joinedIdeas, setJoinedIdeas] = useState<IdeaWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // My ideas
      const { data: myData } = await supabase
        .from("ideas")
        .select(
          "*, profiles!creator_id(*), comments(count), join_requests(count)",
        )
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      setMyIdeas((myData as IdeaWithDetails[]) || []);

      // Joined ideas (approved)
      const { data: joinReqs } = await supabase
        .from("join_requests")
        .select("idea_id")
        .eq("requester_id", user.id)
        .eq("status", "approved");

      if (joinReqs && joinReqs.length > 0) {
        const ideaIds = joinReqs.map((r) => r.idea_id);
        const { data: joinedData } = await supabase
          .from("ideas")
          .select(
            "*, profiles!creator_id(*), comments(count), join_requests(count)",
          )
          .in("id", ideaIds)
          .order("created_at", { ascending: false });

        setJoinedIdeas((joinedData as IdeaWithDetails[]) || []);
      }

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <UserCircle className="h-20 w-20 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name || "User"}</h1>
          <p className="text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-ideas">
        <TabsList>
          <TabsTrigger value="my-ideas" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            My Ideas ({myIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="joined" className="gap-2">
            <Users className="h-4 w-4" />
            Joined ({joinedIdeas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-ideas" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : myIdeas.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                You haven&apos;t created any ideas yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : joinedIdeas.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                You haven&apos;t joined any ideas yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
