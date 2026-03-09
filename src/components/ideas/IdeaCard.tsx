import { memo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { LikeButton } from "./LikeButton";
import { UserCircle, MessageSquare, Users, Sparkles } from "lucide-react";
import type { IdeaWithDetails } from "@/lib/types/database.types";

function isNewIdea(dateStr: string): boolean {
  const created = new Date(dateStr).getTime();
  const now = Date.now();
  return now - created < 60 * 60 * 1000; // 1 hour
}

interface IdeaCardProps {
  idea: IdeaWithDetails;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(dateStr: string): string {
  return dateFormatter.format(new Date(dateStr));
}

export const IdeaCard = memo(function IdeaCard({ idea }: IdeaCardProps) {
  const commentCount = idea.comments?.[0]?.count || 0;
  const joinCount = idea.join_requests?.[0]?.count || 0;
  const likeCount = idea.idea_likes?.[0]?.count || 0;
  const coverImage = idea.image_urls?.[0] ?? null;

  // Compute "new" status on client only to avoid hydration mismatch
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    setIsNew(isNewIdea(idea.created_at));
  }, [idea.created_at]);

  return (
    <Link href={`/ideas/${idea.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer overflow-hidden">
        {/* Cover image */}
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={idea.title}
            className="w-full h-36 object-cover"
          />
        )}
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                {idea.title}
              </h3>
              {isNew && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase flex-shrink-0 border border-green-300 dark:border-green-700">
                  <Sparkles className="h-3 w-3" />
                  New
                </span>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {idea.category.map((cat) => (
                <CategoryBadge key={cat} category={cat} />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {idea.description.length > 150
              ? idea.description.slice(0, 150) + "..."
              : idea.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserCircle className="h-5 w-5" />
            <span className="truncate max-w-[120px]">
              {idea.profiles?.full_name || "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LikeButton ideaId={idea.id} initialCount={likeCount} />
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {joinCount}
            </span>
            <span>{formatDate(idea.created_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
});
