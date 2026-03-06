"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillTag } from "@/components/ideas/SkillTag";
import { UserCircle, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { JoinRequest } from "@/lib/types/database.types";

interface JoinRequestListProps {
  requests: JoinRequest[];
  onApprove: (id: string) => Promise<{ error: unknown }>;
  onReject: (id: string) => Promise<{ error: unknown }>;
}

export function JoinRequestList({
  requests,
  onApprove,
  onReject,
}: JoinRequestListProps) {
  const handleApprove = async (id: string) => {
    const { error } = await onApprove(id);
    if (error) {
      toast.error("Could not approve request");
    } else {
      toast.success("Request approved");
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await onReject(id);
    if (error) {
      toast.error("Could not reject request");
    } else {
      toast.success("Request rejected");
    }
  };

  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No join requests yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCircle className="h-8 w-8 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {req.profiles?.full_name || "Anonymous"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {req.profiles?.email}
                </p>
              </div>
            </div>
            <StatusBadge status={req.status} />
          </div>

          {req.relevant_skills && req.relevant_skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {req.relevant_skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          )}

          {req.message && (
            <p className="text-sm text-muted-foreground italic">
              &quot;{req.message}&quot;
            </p>
          )}

          {req.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => handleApprove(req.id)}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(req.id)}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
          Rejected
        </Badge>
      );
    default:
      return null;
  }
}
