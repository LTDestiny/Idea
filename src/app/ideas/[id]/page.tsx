"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";
import { useJoinRequests } from "@/hooks/useJoinRequests";
import { CategoryBadge } from "@/components/ideas/CategoryBadge";
import { CommentList } from "@/components/comments/CommentList";
import { CommentForm } from "@/components/comments/CommentForm";
import { JoinRequestButton } from "@/components/join/JoinRequestButton";
import { JoinRequestModal } from "@/components/join/JoinRequestModal";
import { JoinRequestList } from "@/components/join/JoinRequestList";
import { LoginPromptBanner } from "@/components/auth/LoginPromptBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserCircle,
  MessageSquare,
  Users,
  Crown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { LikeButton } from "@/components/ideas/LikeButton";
import type { Idea, Profile } from "@/lib/types/database.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(dateStr: string): string {
  return dateFormatter.format(new Date(dateStr));
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;

  const { user, loading: authLoading } = useAuth();
  const {
    comments,
    totalCount: commentsCount,
    loading: commentsLoading,
    addComment,
  } = useComments(ideaId);
  const { requests, userRequest, createRequest, updateRequestStatus } =
    useJoinRequests(ideaId, user?.id);

  const [idea, setIdea] = useState<(Idea & { profiles: Profile }) | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchIdea = async () => {
      const [ideaRes, likesRes] = await Promise.all([
        supabase
          .from("ideas")
          .select("*, profiles!creator_id(*)")
          .eq("id", ideaId)
          .single(),
        supabase
          .from("idea_likes")
          .select("id", { count: "exact", head: true })
          .eq("idea_id", ideaId),
      ]);

      if (ideaRes.error || !ideaRes.data) {
        toast.error("Idea not found");
        router.push("/");
        return;
      }

      setIdea(ideaRes.data as Idea & { profiles: Profile });
      setLikeCount(likesRes.count ?? 0);
      setLoading(false);
    };

    fetchIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

  // Realtime subscription for idea updates
  useEffect(() => {
    const channel = supabase
      .channel(`idea:id=eq.${ideaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ideas",
          filter: `id=eq.${ideaId}`,
        },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            toast.info("This idea has been deleted");
            router.push("/");
          } else if (payload.eventType === "UPDATE") {
            const { data } = await supabase
              .from("ideas")
              .select("*, profiles!creator_id(*)")
              .eq("id", ideaId)
              .single();
            if (data) {
              setIdea(data as Idea & { profiles: Profile });
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ideaId, supabase, router]);

  const handleDelete = useCallback(async () => {
    const { error } = await supabase.from("ideas").delete().eq("id", ideaId);

    if (error) {
      toast.error("Could not delete idea");
    } else {
      toast.success("Idea deleted");
      router.push("/");
      router.refresh();
    }
  }, [supabase, ideaId, router]);

  const handleAddComment = useCallback(
    async (content: string, imageUrl?: string) => {
      if (!user) return { error: new Error("Not authenticated") };
      const result = await addComment(content, user.id, undefined, imageUrl);
      if (!result.error) {
        supabase
          .rpc("create_idea_notification", {
            p_idea_id: ideaId,
            p_actor_id: user.id,
            p_type: "comment",
            p_message: "commented on your idea",
          })
          .then();
      }
      return result;
    },
    [user, addComment, supabase, ideaId],
  );

  const handleReplyComment = useCallback(
    async (content: string, parentId: string, replyToUserId?: string, imageUrl?: string) => {
      if (!user) return { error: new Error("Not authenticated") };
      const result = await addComment(content, user.id, parentId, imageUrl);
      if (!result.error) {
        supabase
          .rpc("create_idea_notification", {
            p_idea_id: ideaId,
            p_actor_id: user.id,
            p_type: "reply",
            p_message: "replied to a comment",
            p_also_notify_user_id: replyToUserId || null,
          })
          .then();
      }
      return result;
    },
    [user, addComment, supabase, ideaId],
  );

  const handleCreateJoinRequest = useCallback(
    async (data: { message: string; relevant_skills: string[] }) => {
      if (!user) return { error: new Error("Not authenticated") };

      const result = await createRequest(data, user.id);

      // Create notification for the idea owner
      if (!result.error && result.data) {
        supabase
          .rpc("create_idea_notification", {
            p_idea_id: ideaId,
            p_actor_id: user.id,
            p_type: "join_request",
            p_message: "requested to join your idea",
            p_target_user_id: idea?.creator_id,
          })
          .then();
      }

      // Call edge function for email notification (fire & forget)
      if (!result.error && result.data) {
        try {
          await supabase.functions.invoke("notify-idea-owner", {
            body: { join_request_id: result.data.id },
          });
        } catch (err) {
          console.error("Failed to notify idea owner:", err);
        }
      }

      return result;
    },
    [user, createRequest, supabase],
  );

  const isOwner = !authLoading && user && idea && user.id === idea.creator_id;
  const approvedMembers = requests.filter((r) => r.status === "approved");

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">{idea.title}</h1>
                <LikeButton ideaId={ideaId} initialCount={likeCount} size="md" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {idea.category.map((cat) => (
                  <CategoryBadge key={cat} category={cat} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserCircle className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {idea.profiles?.full_name || "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {idea.profiles?.email}
                </p>
              </div>
              <span className="text-sm text-muted-foreground ml-auto">
                {formatDate(idea.created_at)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{idea.description}</p>
          </div>

          {/* Idea images */}
          {idea.image_urls && idea.image_urls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {idea.image_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-full h-40 object-cover rounded-md border hover:opacity-90 transition-opacity"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Looking for */}
          {idea.looking_for && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h3 className="text-sm font-semibold">🔍 Looking for:</h3>
              <p className="text-sm whitespace-pre-wrap">{idea.looking_for}</p>
            </div>
          )}

          {/* Zalo group link */}
          {idea.zalo_link && /^https?:\/\//i.test(idea.zalo_link) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <a
                href={idea.zalo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                💬 Join Zalo Group
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Comments section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({commentsCount})
            </h2>

            <CommentList
              comments={comments}
              loading={commentsLoading}
              onReply={user ? handleReplyComment : undefined}
              isAuthenticated={!!user}
            />

            {user ? (
              <CommentForm onSubmit={handleAddComment} />
            ) : (
              <LoginPromptBanner
                message="Sign in to join the discussion"
                redirectTo={`/ideas/${ideaId}`}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join
            </h3>

            <JoinRequestButton
              ideaId={ideaId}
              creatorId={idea.creator_id}
              userRequest={userRequest}
              onJoinClick={() => setJoinModalOpen(true)}
              onDeleteClick={() => setDeleteDialogOpen(true)}
            />
          </div>

          {/* Members list */}
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members ({1 + approvedMembers.length})
            </h3>

            <div className="space-y-2">
              {/* Owner */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40">
                <UserCircle className="h-7 w-7 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {idea.profiles?.full_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {idea.profiles?.email}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium flex-shrink-0">
                  <Crown className="h-3.5 w-3.5" />
                  Owner
                </span>
              </div>

              {/* Approved members */}
              {approvedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/30"
                >
                  <UserCircle className="h-7 w-7 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {member.profiles?.full_name || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.profiles?.email}
                    </p>
                  </div>
                </div>
              ))}

              {approvedMembers.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  No other members yet
                </p>
              )}
            </div>
          </div>

          {/* Join request management (owner only) */}
          {isOwner && (
            <div className="border rounded-lg">
              <Tabs defaultValue="requests">
                <TabsList className="w-full">
                  <TabsTrigger value="requests" className="flex-1">
                    Manage Requests ({requests.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="p-4">
                  <JoinRequestList
                    requests={requests}
                    onApprove={async (id) => {
                      const result = await updateRequestStatus(id, "approved");
                      if (!result.error) {
                        const req = requests.find((r) => r.id === id);
                        if (req && user) {
                          supabase
                            .rpc("create_idea_notification", {
                              p_idea_id: ideaId,
                              p_actor_id: user.id,
                              p_type: "approved",
                              p_message: "approved your join request",
                              p_target_user_id: req.requester_id,
                            })
                            .then();
                        }
                      }
                      return result;
                    }}
                    onReject={async (id) => {
                      const result = await updateRequestStatus(id, "rejected");
                      if (!result.error) {
                        const req = requests.find((r) => r.id === id);
                        if (req && user) {
                          supabase
                            .rpc("create_idea_notification", {
                              p_idea_id: ideaId,
                              p_actor_id: user.id,
                              p_type: "rejected",
                              p_message: "rejected your join request",
                              p_target_user_id: req.requester_id,
                            })
                            .then();
                        }
                      }
                      return result;
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Join request modal */}
      <JoinRequestModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSubmit={handleCreateJoinRequest}
        ideaTitle={idea.title}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this idea? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
