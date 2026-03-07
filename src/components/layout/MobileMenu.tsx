"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Lightbulb,
  Plus,
  UserCircle,
  LogIn,
  LogOut,
  Home,
  Info,
  Users,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database.types";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  profile: Profile | null;
  onCreateIdea: () => void;
  onSignOut: () => void;
}

export function MobileMenu({
  open,
  onClose,
  user,
  profile,
  onCreateIdea,
  onSignOut,
}: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            STEAM
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2 mt-6">
          <Button
            asChild
            variant="ghost"
            className="justify-start gap-3 h-11"
            onClick={onClose}
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-3 h-11"
            onClick={onClose}
          >
            <Link href="/about">
              <Info className="h-4 w-4" />
              About Us
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-3 h-11"
            onClick={onClose}
          >
            <Link href="/members">
              <Users className="h-4 w-4" />
              Members
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="justify-start gap-3 h-11"
            onClick={() => {
              onClose();
              onCreateIdea();
            }}
          >
            <Plus className="h-4 w-4" />
            New Idea
          </Button>

          <Separator className="my-2" />

          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="justify-start gap-3 h-11"
                onClick={onClose}
              >
                <Link href="/profile">
                  <UserCircle className="h-4 w-4" />
                  {profile?.full_name || "Account"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-3 h-11 text-destructive"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="justify-start gap-3 h-11"
              onClick={onClose}
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
