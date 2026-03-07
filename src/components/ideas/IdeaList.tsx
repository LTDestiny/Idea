"use client";

import { useState, useEffect } from "react";
import { useIdeas } from "@/hooks/useIdeas";
import { IdeaCard } from "./IdeaCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_LABELS,
  type IdeaCategory,
  type IdeaWithDetails,
} from "@/lib/types/database.types";

interface IdeaListProps {
  initialData?: IdeaWithDetails[];
}
import { Search, Lightbulb, SortAsc, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allCategories = Object.keys(CATEGORY_LABELS) as IdeaCategory[];

const sortLabels = {
  newest: "Newest",
  most_comments: "Most Comments",
  most_interest: "Most Interest",
};

export function IdeaList({ initialData }: IdeaListProps = {}) {
  const {
    ideas,
    loading,
    categories,
    setCategories,
    setSearch,
    sort,
    setSort,
  } = useIdeas(initialData);
  const [searchInput, setSearchInput] = useState("");
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  const toggleCategory = (cat: IdeaCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="space-y-6">
      {/* Search bar + New Idea */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search ideas..."
            className="pl-10 w-full"
          />
        </div>
        <Button asChild>
          <Link href="/ideas/new" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Idea</span>
          </Link>
        </Button>
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1 flex-wrap">
          <Button
            variant={categories.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={() => setCategories([])}
            className="whitespace-nowrap flex-shrink-0"
          >
            All
          </Button>
          {allCategories.map((cat) => (
            <Button
              key={cat}
              variant={categories.includes(cat) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCategory(cat)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
              <SortAsc className="h-4 w-4" />
              <span className="hidden sm:inline">{sortLabels[sort]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.entries(sortLabels) as [typeof sort, string][]).map(
              ([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSort(key)}
                  className={sort === key ? "bg-accent" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Lightbulb className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No ideas yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to share an idea!
          </p>
          <Button asChild>
            <a href="/ideas/new">Create Idea</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
