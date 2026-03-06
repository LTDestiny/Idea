"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface LoginPromptBannerProps {
  message: string;
  redirectTo?: string;
}

export function LoginPromptBanner({
  message,
  redirectTo,
}: LoginPromptBannerProps) {
  const loginUrl = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-muted/50 border rounded-lg">
      <p className="text-sm text-muted-foreground flex-1">{message}</p>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="gap-2 whitespace-nowrap"
      >
        <a href={loginUrl}>
          <LogIn className="h-4 w-4" />
          Sign In
        </a>
      </Button>
    </div>
  );
}
