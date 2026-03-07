"use client";

import { useState, useMemo, Fragment } from "react";
import Link from "next/link";
import { Crown, Search, ChevronDown, ChevronRight, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from "@/components/ideas/CategoryBadge";
import type { IdeaCategory } from "@/lib/types/database.types";

export interface MemberRow {
  userId: string;
  userName: string;
  email: string;
  ideaId: string;
  ideaTitle: string;
  ideaCategory: IdeaCategory;
  isOwner: boolean;
}

interface IdeaGroup {
  ideaId: string;
  ideaTitle: string;
  ideaCategory: IdeaCategory;
  owner: { userId: string; userName: string; email: string } | null;
  members: { userId: string; userName: string; email: string }[];
}

interface MembersTableProps {
  rows: MemberRow[];
}

export default function MembersTable({ rows }: MembersTableProps) {
  const [userFilter, setUserFilter] = useState("");
  const [ideaFilter, setIdeaFilter] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const map = new Map<string, IdeaGroup>();
    for (const r of rows) {
      let group = map.get(r.ideaId);
      if (!group) {
        group = {
          ideaId: r.ideaId,
          ideaTitle: r.ideaTitle,
          ideaCategory: r.ideaCategory,
          owner: null,
          members: [],
        };
        map.set(r.ideaId, group);
      }
      if (r.isOwner) {
        group.owner = {
          userId: r.userId,
          userName: r.userName,
          email: r.email,
        };
      } else {
        group.members.push({
          userId: r.userId,
          userName: r.userName,
          email: r.email,
        });
      }
    }
    return Array.from(map.values());
  }, [rows]);

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const matchIdea =
        !ideaFilter ||
        g.ideaTitle.toLowerCase().includes(ideaFilter.toLowerCase());
      const matchUser =
        !userFilter ||
        (g.owner &&
          (g.owner.userName.toLowerCase().includes(userFilter.toLowerCase()) ||
            g.owner.email.toLowerCase().includes(userFilter.toLowerCase()))) ||
        g.members.some(
          (m) =>
            m.userName.toLowerCase().includes(userFilter.toLowerCase()) ||
            m.email.toLowerCase().includes(userFilter.toLowerCase()),
        );
      return matchIdea && matchUser;
    });
  }, [groups, userFilter, ideaFilter]);

  const toggleExpand = (ideaId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(ideaId)) next.delete(ideaId);
      else next.add(ideaId);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by user name..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by idea..."
            value={ideaFilter}
            onChange={(e) => setIdeaFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-8 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-medium">Idea</th>
                <th className="text-left px-4 py-3 font-medium">Owner</th>
                <th className="text-center px-4 py-3 font-medium">Members</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((group) => {
                  const isOpen = expanded.has(group.ideaId);
                  const hasMembers = group.members.length > 0;
                  return (
                    <Fragment key={group.ideaId}>
                      {/* Idea owner row */}
                      <tr
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          hasMembers ? "cursor-pointer" : ""
                        } ${isOpen ? "bg-muted/20" : ""}`}
                        onClick={() => hasMembers && toggleExpand(group.ideaId)}
                      >
                        <td className="px-2 py-3 text-center">
                          {hasMembers &&
                            (isOpen ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground mx-auto" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground mx-auto" />
                            ))}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/ideas/${group.ideaId}`}
                            className="hover:underline inline-flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate max-w-[250px] font-medium">
                              {group.ideaTitle}
                            </span>
                            <CategoryBadge category={group.ideaCategory} />
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {group.owner ? (
                            <div className="flex items-center gap-2">
                              <Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                              <div>
                                <p className="font-medium">
                                  {group.owner.userName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {group.owner.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {group.members.length}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded member rows */}
                      {isOpen &&
                        group.members.map((member) => (
                          <tr
                            key={`${group.ideaId}-${member.userId}`}
                            className="border-b last:border-b-0 bg-muted/10 hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-2 py-2"></td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2" colSpan={2}>
                              <div className="flex items-center gap-2 pl-6">
                                <span className="text-muted-foreground text-xs">
                                  └
                                </span>
                                <div>
                                  <p className="font-medium text-sm">
                                    {member.userName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {filtered.length} idea{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
