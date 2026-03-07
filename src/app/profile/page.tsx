"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Lightbulb,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type {
  IdeaWithDetails,
  JoinRequest,
  Idea,
} from "@/lib/types/database.types";

export default function ProfilePage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const [myIdeas, setMyIdeas] = useState<IdeaWithDetails[]>([]);
  const [joinedIdeas, setJoinedIdeas] = useState<IdeaWithDetails[]>([]);
  const [myRequests, setMyRequests] = useState<
    (JoinRequest & { ideas: Idea })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  // Depend on user.id (string) instead of user object to avoid refetching
  // on every object reference change
  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      const [myRes, joinReqRes, reqRes] = await Promise.all([
        supabase
          .from("ideas")
          .select(
            "*, profiles!creator_id(*), comments(count), join_requests(count)",
          )
          .eq("creator_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("join_requests")
          .select("idea_id")
          .eq("requester_id", userId)
          .eq("status", "approved"),
        supabase
          .from("join_requests")
          .select("*, ideas!idea_id(id, title, category)")
          .eq("requester_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      setMyIdeas((myRes.data as IdeaWithDetails[]) || []);
      setMyRequests((reqRes.data as (JoinRequest & { ideas: Idea })[]) || []);

      // Joined ideas — need a second query only if there are approved requests
      if (joinReqRes.data && joinReqRes.data.length > 0) {
        const ideaIds = joinReqRes.data.map((r) => r.idea_id);
        const { data: joinedData } = await supabase
          .from("ideas")
          .select(
            "*, profiles!creator_id(*), comments(count), join_requests(count)",
          )
          .in("id", ideaIds)
          .order("created_at", { ascending: false });

        setJoinedIdeas((joinedData as IdeaWithDetails[]) || []);
      } else {
        setJoinedIdeas([]);
      }

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="max-w-[240px] h-9"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const doSave = async () => {
                      const trimmed = editName.trim();
                      if (!trimmed) return;
                      setSaving(true);
                      const { error } = await updateProfile(trimmed);
                      setSaving(false);
                      if (error) {
                        toast.error("Failed to update name");
                      } else {
                        toast.success("Name updated");
                        setEditing(false);
                      }
                    };
                    doSave();
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={saving}
                onClick={async () => {
                  const trimmed = editName.trim();
                  if (!trimmed) return;
                  setSaving(true);
                  const { error } = await updateProfile(trimmed);
                  setSaving(false);
                  if (error) {
                    toast.error("Failed to update name");
                  } else {
                    toast.success("Name updated");
                    setEditing(false);
                  }
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {profile?.full_name || "User"}
              </h1>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  setEditName(profile?.full_name || "");
                  setEditing(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
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
          <TabsTrigger value="requests" className="gap-2">
            <Send className="h-4 w-4" />
            My Requests ({myRequests.length})
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

        <TabsContent value="requests" className="mt-6">
          {myRequests.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Send className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                You haven&apos;t sent any join requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/ideas/${req.idea_id}`}
                  className="block p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {req.ideas?.title || "Unknown Idea"}
                      </p>
                      {req.message && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          &quot;{req.message}&quot;
                        </p>
                      )}
                    </div>
                    {req.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                    {req.status === "approved" && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </Badge>
                    )}
                    {req.status === "rejected" && (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 gap-1 flex-shrink-0">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
