import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import MembersTable, {
  type MemberRow,
} from "@/components/members/MembersTable";
import type { IdeaCategory } from "@/lib/types/database.types";

export const revalidate = 0;

export default async function MembersPage() {
  const supabase = createServerSupabaseClient();

  const [{ data: profiles }, { data: ideas }, { data: approvedJoins }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true }),
      supabase.from("ideas").select("id, title, category, creator_id"),
      supabase
        .from("join_requests")
        .select("requester_id, idea_id")
        .eq("status", "approved"),
    ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows: MemberRow[] = [];

  // Owner rows
  (ideas ?? []).forEach((idea) => {
    const profile = profileMap.get(idea.creator_id);
    if (profile) {
      rows.push({
        userId: profile.id,
        userName: profile.full_name || "Anonymous",
        email: profile.email ?? "",
        ideaId: idea.id,
        ideaTitle: idea.title,
        ideaCategory: idea.category as IdeaCategory,
        isOwner: true,
      });
    }
  });

  // Member rows
  (approvedJoins ?? []).forEach((join) => {
    const profile = profileMap.get(join.requester_id);
    const idea = (ideas ?? []).find((i) => i.id === join.idea_id);
    if (profile && idea) {
      rows.push({
        userId: profile.id,
        userName: profile.full_name || "Anonymous",
        email: profile.email ?? "",
        ideaId: idea.id,
        ideaTitle: idea.title,
        ideaCategory: idea.category as IdeaCategory,
        isOwner: false,
      });
    }
  });

  // Sort: by idea title, then owner first
  rows.sort((a, b) => {
    const cmp = a.ideaTitle.localeCompare(b.ideaTitle);
    if (cmp !== 0) return cmp;
    if (a.isOwner && !b.isOwner) return -1;
    if (!a.isOwner && b.isOwner) return 1;
    return a.userName.localeCompare(b.userName);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8" />
          Members
        </h1>
        <p className="text-muted-foreground mt-2">
          All community members and the ideas they&apos;re involved in
        </p>
      </div>

      <MembersTable rows={rows} />
    </div>
  );
}
