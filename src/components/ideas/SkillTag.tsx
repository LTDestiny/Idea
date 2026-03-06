interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
  variant?: "default" | "suggestion";
}

export function SkillTag({
  skill,
  onRemove,
  variant = "default",
}: SkillTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        variant === "suggestion"
          ? "bg-cyan-50 text-cyan-600 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800"
          : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
      }`}
    >
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:text-cyan-900 dark:hover:text-cyan-100 focus:outline-none min-w-[20px] min-h-[20px] flex items-center justify-center"
          aria-label={`Xóa ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
