import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Protected routes
  const protectedPaths = ["/ideas/new", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Check edit routes: /ideas/[id]/edit
  const isEditPath = /^\/ideas\/[^/]+\/edit/.test(request.nextUrl.pathname);

  // Only call getUser() (network request) for protected routes
  // For public routes, just refresh session via getSession() (reads from cookie, no network call)
  if (isProtectedPath || isEditPath) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      url.searchParams.set("message", "Please sign in to continue");
      const redirectResponse = NextResponse.redirect(url);
      // Propagate cookies from supabaseResponse to redirect so token refreshes aren't lost
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      redirectResponse.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate",
      );
      return redirectResponse;
    }
  } else {
    // For public routes: refresh session token from cookie (fast, no network call)
    await supabase.auth.getSession();
  }

  // Prevent caching of middleware responses to ensure fresh cookies
  supabaseResponse.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate",
  );

  return supabaseResponse;
}
