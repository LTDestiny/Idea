import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import { UserCircle, MessageSquare, Users } from "lucide-react";
import type { IdeaWithDetails } from "@/lib/types/database.types";

interface IdeaCardProps {
  idea: IdeaWithDetails;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const commentCount = idea.comments?.[0]?.count || 0;
  const joinCount = idea.join_requests?.[0]?.count || 0;

  return (
    <Link href={`/ideas/${idea.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {idea.title}
            </h3>
            <CategoryBadge category={idea.category} />
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
}
