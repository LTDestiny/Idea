"use client";

import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoginPromptBanner } from "@/components/auth/LoginPromptBanner";
import {
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import type { JoinRequest } from "@/lib/types/database.types";

interface JoinRequestButtonProps {
  ideaId: string;
  creatorId: string;
  userRequest: JoinRequest | null;
  onJoinClick: () => void;
  onDeleteClick: () => void;
}

export function JoinRequestButton({
  ideaId,
  creatorId,
  userRequest,
  onJoinClick,
  onDeleteClick,
}: JoinRequestButtonProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Guest
  if (!user) {
    return (
      <LoginPromptBanner
        message="Sign in to request joining this idea"
        redirectTo={`/ideas/${ideaId}`}
      />
    );
  }

  // Owner
  if (user.id === creatorId) {
    return (
      <div className="space-y-3">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          This is your idea
        </Badge>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`/ideas/${ideaId}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </a>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteClick}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  // Has existing request
  if (userRequest) {
    switch (userRequest.status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-sm px-3 py-1.5 gap-2">
            <Clock className="h-4 w-4" />
            Pending Approval
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm px-3 py-1.5 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Joined
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm px-3 py-1.5 gap-2">
            <XCircle className="h-4 w-4" />
            Request Rejected
          </Badge>
        );
    }
  }

  // Logged in, can request
  return (
    <Button onClick={onJoinClick} className="gap-2 w-full sm:w-auto">
      <UserPlus className="h-4 w-4" />
      Request to Join
    </Button>
  );
}
