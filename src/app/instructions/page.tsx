import {
  Lightbulb,
  Plus,
  Pencil,
  Trash2,
  Users,
  Sun,
  Moon,
  UserCircle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Send,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InstructionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <section className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            User Guide
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A detailed guide to the main features of the GLOCAL STEAM platform —
          managing Ideas, members, themes, and your profile.
        </p>
      </section>

      {/* Table of contents */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <a href="#idea-crud" className="text-primary hover:underline">
                Manage Ideas (Create, Update, Delete)
              </a>
            </li>
            <li>
              <a href="#member-crud" className="text-primary hover:underline">
                Manage Members (Join Request, Approve, Reject)
              </a>
            </li>
            <li>
              <a href="#theme" className="text-primary hover:underline">
                Theme Mode (Light / Dark)
              </a>
            </li>
            <li>
              <a href="#profile" className="text-primary hover:underline">
                Profile
              </a>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* ===================== 1. IDEA CRUD ===================== */}
      <section id="idea-crud" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">1. Manage Ideas</h2>
        </div>

        {/* Create */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
              Create a New Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> You must be{" "}
              <Badge variant="secondary">signed in</Badge> to create an Idea.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Steps:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>
                  Click the{" "}
                  <Badge className="gap-1">
                    <Plus className="h-3 w-3" /> New Idea
                  </Badge>{" "}
                  button on the Navbar.
                </li>
                <li>
                  Fill in the required fields:
                  <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                    <li>
                      <strong>Title</strong> — Your idea title (max 50
                      characters).
                    </li>
                    <li>
                      <strong>Description</strong> — Detailed description (max
                      5000 characters).
                    </li>
                    <li>
                      <strong>Category</strong> — Select at least 1 GLOCAL STEAM
                      category (Science, Technology, Engineering, Art,
                      Mathematics).
                    </li>
                  </ul>
                </li>
                <li>
                  (Optional) Fill in <strong>Looking for</strong> — Describe the
                  skills/roles you are looking for.
                </li>
                <li>
                  Click <strong>Submit</strong> to create your Idea.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Update */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Edit an Idea (Update)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> Only the{" "}
              <Badge variant="secondary">owner</Badge> of an Idea can edit it.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Steps:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Go to the detail page of an Idea you created.</li>
                <li>
                  Click the{" "}
                  <Badge variant="outline" className="gap-1">
                    <Pencil className="h-3 w-3" /> Edit
                  </Badge>{" "}
                  button (only visible if you are the owner).
                </li>
                <li>
                  Update the fields you want to change (Title, Description,
                  Category, Looking for).
                </li>
                <li>
                  Click <strong>Save</strong> to save your changes.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Delete */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              Delete an Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> Only the{" "}
              <Badge variant="secondary">owner</Badge> of an Idea can delete it.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Steps:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Go to the detail page of an Idea you created.</li>
                <li>
                  Click the{" "}
                  <Badge variant="destructive" className="gap-1">
                    <Trash2 className="h-3 w-3" /> Delete
                  </Badge>{" "}
                  button.
                </li>
                <li>
                  A confirmation dialog will appear — click{" "}
                  <strong>Confirm</strong> to permanently delete.
                </li>
              </ol>
            </div>
            <p className="text-destructive text-xs mt-2">
              ⚠️ This action cannot be undone. All related comments and join
              requests will also be deleted.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 2. MEMBER CRUD ===================== */}
      <section id="member-crud" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">2. Manage Members</h2>
        </div>

        {/* Join Request */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              Send a Join Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> You must be{" "}
              <Badge variant="secondary">signed in</Badge> and not be the owner
              of the Idea.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Go to the detail page of the Idea you want to join.</li>
              <li>
                Click the{" "}
                <Badge className="gap-1">
                  <Send className="h-3 w-3" /> Join
                </Badge>{" "}
                button.
              </li>
              <li>Write an introduction message (optional).</li>
              <li>
                Click <strong>Send Request</strong> — the request will be sent
                to the Idea owner.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Approve / Reject */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Approve / Reject Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> Only the{" "}
              <Badge variant="secondary">owner</Badge> of an Idea can approve or
              reject requests.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Go to the detail page of an Idea you own.</li>
              <li>
                In the <strong>Join Requests</strong> section, you will see a
                list of pending requests.
              </li>
              <li>
                Click{" "}
                <Badge variant="outline" className="gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" /> Approve
                </Badge>{" "}
                to accept, or{" "}
                <Badge variant="outline" className="gap-1 text-red-600">
                  <XCircle className="h-3 w-3" /> Reject
                </Badge>{" "}
                to decline.
              </li>
            </ol>
            <p className="text-muted-foreground text-xs mt-2">
              💡 Approved members will appear on the <strong>Members</strong>{" "}
              page and in the Idea&apos;s member list.
            </p>
          </CardContent>
        </Card>

        {/* Remove Member */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              Remove a Member
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              <strong>Requirement:</strong> Only the{" "}
              <Badge variant="secondary">owner</Badge> of an Idea can remove
              members.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-2">
              <li>Go to the detail page of an Idea you own.</li>
              <li>
                In the member list, click the remove button next to the member
                you want to remove.
              </li>
              <li>Confirm to complete the removal.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 3. THEME ===================== */}
      <section id="theme" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <Sun className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">3. Theme Mode</h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
            <p>
              GLOCAL STEAM supports <strong>2 display modes</strong>: Light and
              Dark. The system defaults to your operating system&apos;s
              preference.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Sun className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Light Mode</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    A bright interface, suitable for daytime use or well-lit
                    environments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Moon className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    A dark interface that reduces eye strain during nighttime
                    use.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">How to switch:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>
                  Find the <Sun className="inline h-4 w-4 text-yellow-500" /> /{" "}
                  <Moon className="inline h-4 w-4 text-indigo-500" /> icon on
                  the Navbar (top right).
                </li>
                <li>Click the icon to toggle between Light and Dark mode.</li>
                <li>
                  Your preference is saved automatically and applied on future
                  visits.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="mb-14" />

      {/* ===================== 4. PROFILE ===================== */}
      <section id="profile" className="mb-14 scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">4. Profile</h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
            <p>
              The Profile page displays your personal information and a summary
              of your activity on the platform.
            </p>

            <div className="space-y-2">
              <p className="font-medium">Displayed information:</p>
              <ul className="list-disc list-inside ml-2 space-y-1.5">
                <li>
                  <strong>Display Name</strong> — You can edit it by clicking
                  the <Pencil className="inline h-3.5 w-3.5" /> icon next to
                  your name.
                </li>
                <li>
                  <strong>Email</strong> — The email address from your sign-in
                  account (cannot be changed).
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Profile tabs:</p>
              <ul className="list-disc list-inside ml-2 space-y-1.5">
                <li>
                  <strong>My Ideas</strong> — A list of all Ideas you have
                  created.
                </li>
                <li>
                  <strong>Joined Ideas</strong> — A list of Ideas you have been
                  approved to join.
                </li>
                <li>
                  <strong>My Requests</strong> — The status of join requests you
                  have sent (Pending / Approved / Rejected).
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">How to access:</p>
              <ol className="list-decimal list-inside space-y-1.5 ml-2">
                <li>Sign in to your account.</li>
                <li>
                  Click your name or the{" "}
                  <UserCircle className="inline h-4 w-4" /> icon on the Navbar.
                </li>
                <li>
                  You will be redirected to the <strong>/profile</strong> page.
                </li>
              </ol>
            </div>

            <p className="text-muted-foreground text-xs">
              💡 If you are not signed in, the Profile page will not display any
              content. Please sign in to view and manage your profile.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center mt-10">
        <p className="text-muted-foreground mb-4">
          Ready to get started? Explore and share your ideas now!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Explore Ideas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about" className="gap-2">
              Learn about GLOCAL STEAM
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
