export type IdeaCategory =
  | "social_sciences"
  | "it"
  | "mechanical"
  | "electrical"
  | "chemical"
  | "biotechnology"
  | "civil_engineering"
  | "tourism"
  | "education"
  | "health"
  | "environment"
  | "business"
  | "art"
  | "other";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory[];
  looking_for: string | null;
  zalo_link: string | null;
  image_urls: string[];
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaWithDetails extends Idea {
  profiles: Profile;
  comments: { count: number }[];
  join_requests: { count: number }[];
  idea_likes: { count: number }[];
}

export interface Comment {
  id: string;
  idea_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
  profiles: Profile;
  replies?: Comment[];
}

export interface JoinRequest {
  id: string;
  idea_id: string;
  requester_id: string;
  status: RequestStatus;
  message: string | null;
  relevant_skills: string[];
  created_at: string;
  profiles: Profile;
}

export interface IdeaFormData {
  title: string;
  description: string;
  category: IdeaCategory[];
  looking_for: string;
  zalo_link: string;
  image_urls: string[];
}

export type NotificationType =
  | "comment"
  | "reply"
  | "join_request"
  | "approved"
  | "rejected";

export interface Notification {
  id: string;
  user_id: string;
  idea_id: string;
  type: NotificationType;
  actor_id: string;
  message: string;
  read: boolean;
  created_at: string;
  actor?: Profile;
}

export interface JoinRequestFormData {
  message: string;
  relevant_skills: string[];
}

export const CATEGORY_LABELS: Record<IdeaCategory, string> = {
  social_sciences: "Social Sciences",
  it: "IT",
  mechanical: "Mechanical Engineering",
  electrical: "Electric & Electronic Engineering",
  chemical: "Chemical Engineering",
  biotechnology: "Biotechnology",
  civil_engineering: "Civil Engineering",
  tourism: "Tourism",
  education: "Education",
  health: "Health",
  environment: "Environment",
  business: "Business",
  art: "Art",
  other: "Other",
};

export const CATEGORY_COLORS: Record<
  IdeaCategory,
  { bg: string; text: string; border: string; icon: string }
> = {
  social_sciences: {
    bg: "bg-rose-100 dark:bg-rose-950",
    text: "text-rose-700 dark:text-rose-300",
    border: "border border-rose-300 dark:border-rose-700",
    icon: "🤝",
  },
  it: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    border: "border border-blue-300 dark:border-blue-700",
    icon: "💻",
  },
  mechanical: {
    bg: "bg-gray-100 dark:bg-gray-950",
    text: "text-gray-700 dark:text-gray-300",
    border: "border border-gray-300 dark:border-gray-700",
    icon: "⚙️",
  },
  electrical: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border border-yellow-300 dark:border-yellow-700",
    icon: "⚡",
  },
  chemical: {
    bg: "bg-cyan-100 dark:bg-cyan-950",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border border-cyan-300 dark:border-cyan-700",
    icon: "🧪",
  },
  biotechnology: {
    bg: "bg-lime-100 dark:bg-lime-950",
    text: "text-lime-700 dark:text-lime-300",
    border: "border border-lime-300 dark:border-lime-700",
    icon: "🧬",
  },
  civil_engineering: {
    bg: "bg-stone-100 dark:bg-stone-950",
    text: "text-stone-700 dark:text-stone-300",
    border: "border border-stone-300 dark:border-stone-700",
    icon: "🏗️",
  },
  tourism: {
    bg: "bg-sky-100 dark:bg-sky-950",
    text: "text-sky-700 dark:text-sky-300",
    border: "border border-sky-300 dark:border-sky-700",
    icon: "✈️",
  },
  education: {
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    border: "border border-amber-300 dark:border-amber-700",
    icon: "📚",
  },
  health: {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border border-emerald-300 dark:border-emerald-700",
    icon: "🩺",
  },
  environment: {
    bg: "bg-teal-100 dark:bg-teal-950",
    text: "text-teal-700 dark:text-teal-300",
    border: "border border-teal-300 dark:border-teal-700",
    icon: "🌿",
  },
  business: {
    bg: "bg-violet-100 dark:bg-violet-950",
    text: "text-violet-700 dark:text-violet-300",
    border: "border border-violet-300 dark:border-violet-700",
    icon: "💼",
  },
  art: {
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    border: "border border-orange-300 dark:border-orange-700",
    icon: "🎨",
  },
  other: {
    bg: "bg-slate-100 dark:bg-slate-950",
    text: "text-slate-700 dark:text-slate-300",
    border: "border border-slate-300 dark:border-slate-700",
    icon: "📌",
  },
};
