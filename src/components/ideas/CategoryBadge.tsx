import { memo } from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type IdeaCategory,
} from "@/lib/types/database.types";

interface CategoryBadgeProps {
  category: IdeaCategory;
  className?: string;
}

export const CategoryBadge = memo(function CategoryBadge({
  category,
  className,
}: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} ${className || ""}`}
    >
      <span>{colors.icon}</span>
      {label}
    </span>
  );
});
