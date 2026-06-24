import type { Post } from "./types";
import { CURRENT_USER_PID } from "./mock-data";

// The CMS "experience" the user is currently acting as (§3 roles). Editors can
// review (approve/reject/publish) any post; reporters only submit for review.
export type Role = "editor" | "reporter";

// The 4 persisted post states (a 5th, transient state — the unsaved "new post"
// in the composer — never becomes a Post, so it isn't modeled here).
export type PostKind = "pending" | "published" | "rejected" | "draft";

export function getPostKind(post: Post): PostKind {
  if (post.status.mid === "published") return "published";
  if (post.reviewStatus === "pending") return "pending";
  if (post.reviewStatus === "rejected") return "rejected";
  return "draft";
}

export function isOwnPost(post: Post): boolean {
  return post.authors.some((a) => a.pid === CURRENT_USER_PID);
}

// Owners can always manage their own post; editors can manage anyone's (§3).
export function canManagePost(post: Post, canReview: boolean): boolean {
  return isOwnPost(post) || canReview;
}

export function nowISO(): string {
  return new Date().toISOString();
}

// Human "time since" for the editor's "Pending for …" indicator.
export function formatElapsed(sinceISO: string): string {
  const ms = Date.now() - new Date(sinceISO).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "less than a minute";
  if (min < 60) return `${min} min`;
  const hr = Math.floor(min / 60);
  const rem = min % 60;
  if (hr < 24) return rem ? `${hr} hr ${rem} min` : `${hr} hr`;
  const d = Math.floor(hr / 24);
  return `${d} day${d > 1 ? "s" : ""}`;
}

// Compact form for the feed's "Pending: 3h ago" badge.
export function formatElapsedShort(sinceISO: string): string {
  const ms = Date.now() - new Date(sinceISO).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// An AdSense slot inserted into the feed, anchored after a post (null = top).
export interface Ad {
  id: string;
  afterPid: string | null;
}

// A saved promotion card (library). When posted, `inFeed` is true and it renders
// in the feed anchored after `afterPid` (null = top).
export interface PromotionCard {
  id: string;
  name: string;
  title: string;
  description: string;
  imageURL: string;
  inFeed: boolean;
  afterPid: string | null;
}
