"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/lib/types/database.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return dateFormatter.format(date);
}

const TYPE_ICON: Record<string, typeof MessageSquare> = {
  comment: MessageSquare,
  join_request: UserPlus,
  approved: UserCheck,
  rejected: UserX,
};

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = TYPE_ICON[notification.type] || MessageSquare;
  const actorName = notification.actor?.full_name || "Someone";

  return (
    <Link
      href={`/ideas/${notification.idea_id}`}
      onClick={() => {
        if (!notification.read) onRead(notification.id);
      }}
      className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
        !notification.read ? "bg-primary/5" : ""
      }`}
    >
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${!notification.read ? "font-medium" : "text-muted-foreground"}`}
        >
          <span className="font-semibold">{actorName}</span>{" "}
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {timeAgo(notification.created_at)}
        </p>
      </div>
      {!notification.read && (
        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
      )}
    </Link>
  );
}

export function NotificationBell({ userId }: { userId: string }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(userId);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-background border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2.5 border-b">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="overflow-y-auto max-h-80 divide-y">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={markAsRead}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
