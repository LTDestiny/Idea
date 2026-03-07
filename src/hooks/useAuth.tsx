"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database.types";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ data: unknown; error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let ignore = false;

    const fetchProfile = (userId: string) =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
        .then(({ data }) => {
          if (!ignore && data) setProfile(data);
        });

    // Single source of truth: onAuthStateChange handles ALL events
    // including INITIAL_SESSION (reads cookie → refreshes token if needed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (ignore) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Fire-and-forget — don't block loading on profile fetch
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Safety net: if Supabase hangs (slow token refresh, network issues),
    // stop loading so the UI is never permanently stuck
    const safetyTimeout = setTimeout(() => {
      if (!ignore) setLoading(false);
    }, 4000);

    return () => {
      ignore = true;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `https://idea-hazel.vercel.app/auth/callback`,
        },
      });
      return { data, error };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  }, [supabase]);

  const updateProfile = useCallback(
    async (fullName: string) => {
      if (!user) return { error: new Error("Not authenticated") };
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);
      if (!error) {
        setProfile((prev) => (prev ? { ...prev, full_name: fullName } : prev));
      }
      return { error };
    },
    [supabase, user],
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      updateProfile,
    }),
    [
      user,
      profile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
