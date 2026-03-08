"use client";

import { useState, memo } from "react";
import { UserCircle, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm } from "./CommentForm";
import type { Comment } from "@/lib/types/database.types";

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  onReply?: (content: string, parentId: string) => Promise<{ error: unknown }>;
  isAuthenticated?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return dateFormatter.format(date);
}

/** Render comment content, highlighting @[Name] mentions */
function renderContent(content: string) {
  const mentionMatch = content.match(/^@\[([^\]]+)\]\s?/);
  if (mentionMatch) {
    const name = mentionMatch[1];
    const rest = content.slice(mentionMatch[0].length);
    return (
      <>
        <span className="text-primary font-semibold">@{name}</span> {rest}
      </>
    );
  }
  return content;
}

const CommentItem = memo(function CommentItem({
  comment,
  onReply,
  isAuthenticated,
  depth = 0,
}: {
  comment: Comment;
  onReply?: (content: string, parentId: string) => Promise<{ error: unknown }>;
  isAuthenticated?: boolean;
  depth?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  // When replying to a reply (depth > 0), resolve to root parent and add @mention
  const replyParentId =
    depth === 0 ? comment.id : comment.parent_id || comment.id;
  const mentionName =
    depth > 0 ? comment.profiles?.full_name || "Anonymous" : undefined;

  const handleReply = async (content: string) => {
    if (!onReply) return { error: new Error("No reply handler") };
    return onReply(content, replyParentId);
  };

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}>
      <div className="flex gap-3">
        <UserCircle className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {comment.profiles?.full_name || "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap break-words">
            {renderContent(comment.content)}
          </p>

          {/* Reply button — available on all comments */}
          {isAuthenticated && onReply && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 px-2 mt-1 text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </Button>
          )}

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                onSubmit={handleReply}
                placeholder={`Reply to ${comment.profiles?.full_name || "Anonymous"}...`}
                compact
                onCancel={() => setShowReplyForm(false)}
                mentionName={mentionName}
              />
            </div>
          )}
        </div>
      </div>

      {/* Render replies — flat (all at depth 1, no further nesting) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isAuthenticated={isAuthenticated}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export function CommentList({
  comments,
  loading,
  onReply,
  isAuthenticated,
}: CommentListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
