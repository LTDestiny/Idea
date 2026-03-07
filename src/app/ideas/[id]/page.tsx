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
import { UserCircle, MessageSquare, Users, Crown } from "lucide-react";
import { toast } from "sonner";
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
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchIdea = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*, profiles!creator_id(*)")
        .eq("id", ideaId)
        .single();

      if (error || !data) {
        toast.error("Idea not found");
        router.push("/");
        return;
      }

      setIdea(data as Idea & { profiles: Profile });
      setLoading(false);
    };

    fetchIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaId]);

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
    async (content: string) => {
      if (!user) return { error: new Error("Not authenticated") };
      return addComment(content, user.id);
    },
    [user, addComment],
  );

  const handleReplyComment = useCallback(
    async (content: string, parentId: string) => {
      if (!user) return { error: new Error("Not authenticated") };
      return addComment(content, user.id, parentId);
    },
    [user, addComment],
  );

  const handleCreateJoinRequest = useCallback(
    async (data: { message: string; relevant_skills: string[] }) => {
      if (!user) return { error: new Error("Not authenticated") };

      const result = await createRequest(data, user.id);

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
              <h1 className="text-2xl sm:text-3xl font-bold">{idea.title}</h1>
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

          {/* Looking for */}
          {idea.looking_for && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <h3 className="text-sm font-semibold">🔍 Looking for:</h3>
              <p className="text-sm whitespace-pre-wrap">{idea.looking_for}</p>
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
                    onApprove={(id) => updateRequestStatus(id, "approved")}
                    onReject={(id) => updateRequestStatus(id, "rejected")}
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
