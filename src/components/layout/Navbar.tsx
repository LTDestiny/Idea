"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import {
  Lightbulb,
  Plus,
  UserCircle,
  LogIn,
  Menu,
  LogOut,
  Info,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleCreateIdea = () => {
    if (!user) {
      toast.info("Please sign in to create an idea");
      router.push("/login?redirect=/ideas/new");
      return;
    }
    router.push("/ideas/new");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span>STEAM_TUI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/about">
              <Info className="h-4 w-4" />
              About Us
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/members">
              <Users className="h-4 w-4" />
              Members
            </Link>
          </Button>

          <Button onClick={handleCreateIdea} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Idea
          </Button>

          <ThemeToggle />

          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <UserCircle className="h-6 w-6" />
                <span className="max-w-[120px] truncate">
                  {profile?.full_name || "User"}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        profile={profile}
        onCreateIdea={handleCreateIdea}
        onSignOut={signOut}
      />
    </header>
  );
}
