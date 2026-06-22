"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { Button, ReviewBadge, StatusBadge } from "./ui";
import { ChevronDown, ChevronUp } from "./icons";
import { LiveBlogArticle } from "./LiveBlogArticle";
import type { ComposerState } from "./PostComposer";
import { AUTHORS, CURRENT_ROLE, CURRENT_USER_PID } from "@/lib/mock-data";

type Filter = "all" | "your" | "pending" | "published";

// You can edit your own posts. As an editor you can review (approve/publish) others'.
function canEditPost(post: Post): boolean {
  return post.authors.some((a) => a.pid === CURRENT_USER_PID);
}
const CAN_REVIEW = CURRENT_ROLE === "editor";

export function PostFeed({
  posts,
  preview,
  editingId,
  onEditPost,
}: {
  posts: Post[];
  preview: ComposerState;
  editingId: string | null;
  onEditPost: (post: Post | null) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  // 0 = the "New Post" preview; 1..N = posts. Driven by the up/down navigator.
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      your: posts.filter((p) => p.authors.some((a) => a.pid === CURRENT_USER_PID)).length,
      pending: posts.filter((p) => p.reviewStatus === "pending").length,
      published: posts.filter((p) => p.status.mid === "published").length,
    }),
    [posts]
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "your":
        return posts.filter((p) => p.authors.some((a) => a.pid === CURRENT_USER_PID));
      case "pending":
        return posts.filter((p) => p.reviewStatus === "pending");
      case "published":
        return posts.filter((p) => p.status.mid === "published");
      default:
        return posts;
    }
  }, [posts, filter]);

  const total = filtered.length;

  // Reset focus to the composer when the filter changes.
  useEffect(() => setFocusedIndex(0), [filter]);

  // Whenever the focused post changes: scroll it into view and either load it into
  // the editor (if editable) or just focus it (reviewer can still act via the menu).
  useEffect(() => {
    itemRefs.current[focusedIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (focusedIndex === 0) {
      onEditPost(null);
      return;
    }
    const post = filtered[focusedIndex - 1];
    onEditPost(post && canEditPost(post) ? post : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex]);

  const tabs: { key: Filter; label: string; danger?: boolean }[] = [
    { key: "all", label: "All" },
    { key: "your", label: "Your" },
    { key: "pending", label: "Pending", danger: true },
    { key: "published", label: "Published" },
  ];

  const previewAuthor = AUTHORS.find((a) => a.pid === preview.authorPID);
  const previewSelected = focusedIndex === 0;

  return (
    <div className="flex flex-col min-h-0">
      {/* Filter bar + focus navigator */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-line bg-white">
        <div className="flex items-center gap-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`text-sm transition ${
                filter === t.key ? "font-medium text-black" : "font-normal text-black/80 hover:text-black"
              }`}
            >
              {t.label}{" "}
              <span className={t.danger ? "text-danger" : "text-black/70"}>({counts[t.key]})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span>
            Post {focusedIndex} of {total}
          </span>
          <div className="flex flex-col">
            <button
              onClick={() => setFocusedIndex((i) => Math.max(0, i - 1))}
              disabled={focusedIndex === 0}
              className="hover:text-black disabled:opacity-30"
              aria-label="Previous post"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFocusedIndex((i) => Math.min(total, i + 1))}
              disabled={focusedIndex >= total}
              className="hover:text-black disabled:opacity-30"
              aria-label="Next post"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed surface */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin bg-feed p-4 space-y-4">
        {/* Live preview (the "New Post"); selected when focusedIndex === 0 */}
        <div
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          onClick={() => setFocusedIndex(0)}
          className={`rounded-lg py-6 flex justify-center transition ${
            previewSelected ? "bg-canvas ring-1 ring-black/10" : "bg-canvas/60"
          }`}
        >
          <LiveBlogArticle
            placeholder
            time="Just now"
            author={previewAuthor?.name}
            title={preview.title}
            body={preview.body}
          />
        </div>

        {/* Posts */}
        {filtered.map((post, i) => (
          <FeedItem
            key={post.pid}
            post={post}
            focused={focusedIndex === i + 1}
            editingHere={editingId === post.pid}
            onFocus={() => setFocusedIndex(i + 1)}
            registerRef={(el) => {
              itemRefs.current[i + 1] = el;
            }}
          />
        ))}

        {total === 0 && (
          <div className="text-center text-sm text-subtle py-10">No posts in this view.</div>
        )}
      </div>
    </div>
  );
}

function FeedItem({
  post,
  focused,
  editingHere,
  onFocus,
  registerRef,
}: {
  post: Post;
  focused: boolean;
  editingHere: boolean;
  onFocus: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const canEdit = canEditPost(post);
  const isDraft = post.status.mid === "draft";
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Editing an editable post happens in the left panel — no inline actions here.
  // A focused non-editable post stays focused with persistent action affordances.
  // A non-focused editable post reveals actions on hover.
  const mode: "editing" | "focus" | "hover" | "none" = editingHere
    ? "editing"
    : focused && !canEdit
    ? "focus"
    : !focused && canEdit
    ? "hover"
    : focused && canEdit
    ? "editing"
    : "none";

  const showActions = mode === "focus" || (mode === "hover" && (hovered || menuOpen));
  const dim = mode === "hover" && (hovered || menuOpen);
  const hideChrome = mode === "editing"; // clean reading view while editing on the left

  // close the menu when focus moves away
  useEffect(() => {
    if (!showActions) setMenuOpen(false);
  }, [showActions]);

  const card = (
    <div className="relative w-[393px]">
      <LiveBlogArticle
        time={post.relativeTime}
        author={post.authors[0]?.name}
        authorImage={post.authors[0]?.imageURL}
        title={post.title}
        body={post.body}
        mediaURL={post.mediaURL}
        pinned={post.pinned}
        showMenuButton={showActions}
        onMenuClick={() => setMenuOpen((v) => !v)}
      />
      {dim && (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/[0.05] transition" />
      )}
      {showActions && menuOpen && (
        <PostMenu post={post} canEdit={canEdit} onAction={() => setMenuOpen(false)} />
      )}
    </div>
  );

  return (
    <div
      ref={registerRef}
      onClick={onFocus}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
    >
      {/* Status / review badges in the left gutter (hidden while editing) */}
      {!hideChrome && (
        <div className="absolute left-0 top-2 flex items-center gap-2 z-10">
          <StatusBadge status={post.status.mid} />
          {isDraft && <ReviewBadge status={post.reviewStatus} />}
        </div>
      )}

      {/* Focused posts sit inside a selected (gray) panel */}
      <div
        className={`rounded-lg py-6 flex justify-center transition ${
          focused ? "bg-canvas ring-1 ring-black/10" : ""
        }`}
      >
        <div className="w-[393px]">
          {card}

          {/* Draft review controls for a focused, reviewable post */}
          {focused && isDraft && post.reviewStatus === "pending" && CAN_REVIEW && (
            <div className="flex items-center gap-2 mt-3 px-1">
              <Button variant="danger" className="flex-1 py-1.5">REJECT</Button>
              <Button variant="primary" className="flex-1 py-1.5">APPROVE</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dropdown menu beside a post (Figma "Filter Options Container"): 178px, 14px items,
// 10/16 padding, white, soft shadow; Delete in danger red. Items adapt to permissions.
function PostMenu({
  post,
  canEdit,
  onAction,
}: {
  post: Post;
  canEdit: boolean;
  onAction: () => void;
}) {
  const isPending = post.reviewStatus === "pending";
  const isPublished = post.status.mid === "published";

  const items: { label: string; danger?: boolean }[] = [];
  if (canEdit) items.push({ label: "Edit" });
  if (canEdit || CAN_REVIEW) items.push({ label: post.pinned ? "Remove the pin" : "Pin to the top" });
  if (isPending && CAN_REVIEW) {
    items.push({ label: "Approve and publish" });
    items.push({ label: "Reject", danger: true });
  }
  if (isPublished && (canEdit || CAN_REVIEW)) items.push({ label: "Unpublish" });
  if (canEdit) items.push({ label: "Delete", danger: true });

  return (
    <div className="absolute left-full top-10 ml-3 w-[178px] rounded-lg bg-white border border-line shadow-lg py-1 z-20">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 ${
            it.danger ? "text-danger" : "text-black"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
