"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { EditorStatusBadge } from "./ui";
import { ChevronDown, ChevronUp, MegaphoneIcon, PencilIcon, PinAngleIcon, PinOffIcon, PlusIcon, TrashIcon, CheckCircleIcon, CloseIcon } from "./icons";
import { LiveBlogArticle } from "./LiveBlogArticle";
import { PromotionCardPreview } from "./PromotionCardModal";
import type { ComposerState } from "./PostComposer";
import { Fragment } from "react";
import { AUTHORS, CURRENT_USER_PID } from "@/lib/mock-data";
import { canManagePost, formatElapsedShort, getPostKind, type Ad, type PostKind, type PromotionCard } from "@/lib/post-helpers";

type Scope = "all" | "mine";
type StatusFilter = "all" | "pending" | "published" | "rejected" | "draft";

export interface PostActions {
  onApprove: (post: Post) => void;
  onReject: (post: Post) => void;
  onDelete: (post: Post) => void;
  onPin: (post: Post) => void;
  onUnpin: (post: Post) => void;
}

export function PostFeed({
  posts,
  preview,
  composingNew,
  focusedPid,
  onFocus,
  onNewPost,
  actions,
  canReview,
  ads,
  onInsertAd,
  onRemoveAd,
  promos,
  onAddPromo,
  onRemovePromo,
}: {
  posts: Post[];
  preview: ComposerState;
  composingNew: boolean;
  focusedPid: string | null;
  onFocus: (pid: string | null) => void;
  onNewPost: () => void;
  actions: PostActions;
  canReview: boolean;
  ads: Ad[];
  onInsertAd: (afterPid: string | null) => void;
  onRemoveAd: (id: string) => void;
  promos: PromotionCard[];
  onAddPromo: () => void;
  onRemovePromo: (id: string) => void;
}) {
  // Only posted cards render in the feed.
  const feedPromos = promos.filter((p) => p.inFeed);
  const [scope, setScope] = useState<Scope>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewRef = useRef<HTMLDivElement | null>(null);
  // Refresh "Pending: Xh ago" badges over time.
  const [, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  // Pinned first, then creation order.
  const scoped = useMemo(() => {
    let list = posts;
    if (scope === "mine") list = list.filter((p) => p.authors.some((a) => a.pid === CURRENT_USER_PID));
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [posts, scope]);

  const statusCounts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: scoped.length, pending: 0, published: 0, rejected: 0, draft: 0 };
    for (const p of scoped) c[getPostKind(p)]++;
    return c;
  }, [scoped]);

  const filtered = useMemo(
    () => (statusFilter === "all" ? scoped : scoped.filter((p) => getPostKind(p) === statusFilter)),
    [scoped, statusFilter]
  );

  const total = filtered.length;
  const focusedIndex = focusedPid === null ? 0 : filtered.findIndex((p) => p.pid === focusedPid) + 1;

  // Drop a stale focus (status change / delete / filter switch) back to the composer.
  useEffect(() => {
    if (focusedPid !== null && !filtered.some((p) => p.pid === focusedPid)) onFocus(null);
  }, [filtered, focusedPid, onFocus]);

  useEffect(() => {
    if (composingNew) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    else if (focusedPid) itemRefs.current[focusedPid]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusedPid, composingNew, filtered]);

  const goTo = (idx: number) => {
    const clamped = Math.max(1, Math.min(total, idx));
    if (total > 0) onFocus(filtered[clamped - 1].pid);
  };

  const previewAuthor = composingNew ? AUTHORS.find((a) => a.pid === preview.authorPID) : undefined;

  return (
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Toolbar: NEW POST + scope dropdown + status dropdown + nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-white gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewPost}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide hover:bg-black/90"
          >
            <PlusIcon className="w-3.5 h-3.5" /> New Post
          </button>
          <button
            onClick={onAddPromo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-zinc-50"
          >
            <MegaphoneIcon className="w-4 h-4" /> Promotion Card
          </button>
          <Dropdown
            label={scope === "all" ? "All posts" : "My posts"}
            options={[
              { value: "all", label: "All posts" },
              { value: "mine", label: "My posts" },
            ]}
            value={scope}
            onChange={(v) => setScope(v as Scope)}
          />
          <Dropdown
            label={`${statusLabel(statusFilter)} (${statusCounts[statusFilter]})`}
            danger={statusFilter === "pending"}
            options={[
              { value: "all", label: `All statuses (${statusCounts.all})` },
              { value: "pending", label: `Pending (${statusCounts.pending})` },
              { value: "published", label: `Published (${statusCounts.published})` },
              { value: "rejected", label: `Rejected (${statusCounts.rejected})` },
              { value: "draft", label: `Draft (${statusCounts.draft})` },
            ]}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-subtle shrink-0">
          <span className="tabular-nums">{focusedIndex} of {total}</span>
          <button
            onClick={() => goTo(focusedIndex - 1)}
            disabled={focusedIndex <= 1}
            className="w-8 h-8 grid place-items-center rounded-lg border border-line bg-white hover:bg-zinc-50 disabled:opacity-30"
            aria-label="Previous post"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo(focusedIndex + 1)}
            disabled={focusedIndex >= total}
            className="w-8 h-8 grid place-items-center rounded-lg border border-line bg-white hover:bg-zinc-50 disabled:opacity-30"
            aria-label="Next post"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed surface */}
      <div className="flex-1 overflow-y-auto scroll-thin bg-surface p-4 space-y-4">
        {/* New-post live preview — only while composing a new post (selected panel) */}
        {composingNew && (
          <div ref={previewRef} className="relative rounded-lg py-6 px-4 flex justify-center bg-panelSel">
            <div className="absolute left-4 top-2 flex items-center gap-1.5 z-10">
              <EditorStatusBadge kind="draft" />
              <span className="text-[11px] font-medium text-muted">Not saved yet</span>
            </div>
            <div className="shadow-[0_6px_20px_rgba(0,0,0,0.10)] rounded-xl">
              <LiveBlogArticle placeholder time="Just now" author={previewAuthor?.name} title={preview.title} body={preview.body} />
            </div>
          </div>
        )}

        {/* Top insertion zone + top-anchored inserts */}
        <InsertAdZone onInsert={() => onInsertAd(null)} />
        {feedPromos.filter((p) => p.afterPid === null).map((promo) => (
          <PromoCard key={promo.id} promo={promo} onRemove={() => onRemovePromo(promo.id)} />
        ))}
        {ads.filter((a) => a.afterPid === null).map((ad) => (
          <AdCard key={ad.id} onRemove={() => onRemoveAd(ad.id)} />
        ))}

        {filtered.map((post) => (
          <Fragment key={post.pid}>
            <FeedItem
              post={post}
              focused={focusedPid === post.pid}
              actions={actions}
              canReview={canReview}
              onFocus={() => onFocus(post.pid)}
              registerRef={(el) => {
                itemRefs.current[post.pid] = el;
              }}
            />
            {feedPromos.filter((p) => p.afterPid === post.pid).map((promo) => (
              <PromoCard key={promo.id} promo={promo} onRemove={() => onRemovePromo(promo.id)} />
            ))}
            {ads.filter((a) => a.afterPid === post.pid).map((ad) => (
              <AdCard key={ad.id} onRemove={() => onRemoveAd(ad.id)} />
            ))}
            <InsertAdZone onInsert={() => onInsertAd(post.pid)} />
          </Fragment>
        ))}

        {total === 0 && <div className="text-center text-sm text-subtle py-10">No posts in this view.</div>}
      </div>
    </div>
  );
}

function FeedItem({
  post,
  focused,
  actions,
  canReview,
  onFocus,
  registerRef,
}: {
  post: Post;
  focused: boolean;
  actions: PostActions;
  canReview: boolean;
  onFocus: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const kind = getPostKind(post);
  const isPublished = kind === "published";
  const manageable = canManagePost(post, canReview);
  const [hovered, setHovered] = useState(false);

  // Chrome (label + icon buttons) shows when focused or hovered.
  const showChrome = focused || hovered;
  // Approve/Reject pills show below a pending post you can review, on hover/focus.
  const showReview = kind === "pending" && canReview && showChrome;

  return (
    <div
      ref={registerRef}
      onClick={onFocus}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
    >
      <div className={`rounded-lg py-6 px-4 transition ${focused ? "bg-panelSel" : ""}`}>
        <div className="mx-auto w-[393px]">
          {/* Post #N + status badge always visible; action icons only on hover */}
          <div className="flex items-center justify-between mb-2 min-h-9">
            <div className="flex items-center gap-2">
              <span className="text-sm text-subtle">Post #{post.postNumber}</span>
              <EditorStatusBadge
                kind={kind}
                pendingFor={kind === "pending" && post.pendingSince ? formatElapsedShort(post.pendingSince) : undefined}
              />
            </div>
            <div className={`flex items-center gap-1.5 transition ${showChrome ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              {isPublished && canReview && (
                <IconBtn
                  tooltip={post.pinned ? "Unpin post" : "Pin post"}
                  onClick={(e) => {
                    e.stopPropagation();
                    post.pinned ? actions.onUnpin(post) : actions.onPin(post);
                  }}
                >
                  {post.pinned ? <PinOffIcon className="w-4 h-4" /> : <PinAngleIcon className="w-4 h-4" />}
                </IconBtn>
              )}
              {manageable && (
                <>
                  <IconBtn tooltip="Edit" onClick={(e) => { e.stopPropagation(); onFocus(); }}>
                    <PencilIcon className="w-4 h-4" />
                  </IconBtn>
                  <IconBtn
                    tooltip="Delete"
                    danger
                    onClick={(e) => { e.stopPropagation(); actions.onDelete(post); }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </IconBtn>
                </>
              )}
            </div>
          </div>

          <div className={focused ? "shadow-[0_6px_20px_rgba(0,0,0,0.10)] rounded-xl" : ""}>
            <LiveBlogArticle
              time={post.relativeTime}
              author={post.authors[0]?.name}
              authorImage={post.authors[0]?.imageURL}
              title={post.title}
              body={post.body}
              mediaURL={post.mediaURL}
              pinned={post.pinned}
            />
          </div>

          {/* Approve / Reject hover pills */}
          {showReview && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={(e) => { e.stopPropagation(); actions.onApprove(post); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-line shadow-sm pl-2.5 pr-3 py-1.5 text-sm font-semibold text-black hover:bg-zinc-50"
              >
                <CheckCircleIcon className="w-4 h-4 text-success" /> Approve and publish
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); actions.onReject(post); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-line shadow-sm pl-2.5 pr-3 py-1.5 text-sm font-semibold text-black hover:bg-zinc-50"
              >
                <CloseIcon className="w-4 h-4 text-danger" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  tooltip,
  danger,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  tooltip: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`grid place-items-center w-9 h-9 rounded-lg border border-line bg-white shadow-sm hover:bg-zinc-50 transition ${
        danger ? "text-danger" : "text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Dropdown({
  label,
  options,
  value,
  onChange,
  danger,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className={`inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-sm hover:bg-zinc-50 ${
          danger ? "text-danger font-medium" : "text-black"
        }`}
      >
        {label}
        <ChevronDown className="w-4 h-4 text-subtle" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 min-w-[180px] rounded-lg border border-line bg-white shadow-lg py-1">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onMouseDown={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 ${
                o.value === value ? "font-semibold text-black" : "text-subtle"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Hover-revealed insertion line between posts: "+ Add ad slot".
function InsertAdZone({ onInsert }: { onInsert: () => void }) {
  return (
    <div className="group/zone relative h-7 flex items-center justify-center">
      <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-transparent group-hover/zone:bg-line transition" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInsert();
        }}
        className="relative z-10 inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-subtle shadow-sm opacity-0 group-hover/zone:opacity-100 hover:text-black hover:border-black/30 transition"
      >
        <PlusIcon className="w-3 h-3" /> Add ad slot
      </button>
    </div>
  );
}

// AdSense placeholder card rendered inline in the feed.
function AdCard({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="group/ad relative mx-auto w-[393px]">
      <div className="rounded-xl border border-dashed border-[#c4c4c4] bg-white px-4 py-6 flex flex-col items-center justify-center gap-2 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Advertisement</span>
        <div className="flex items-center gap-2">
          <AdSenseGlyph />
          <span className="text-sm font-semibold text-[#4b4b4b]">Google AdSense</span>
        </div>
        <span className="text-xs text-muted">Responsive display ad · auto-filled at runtime</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title="Remove ad slot"
        className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-lg border border-line bg-white text-danger shadow-sm opacity-0 group-hover/ad:opacity-100 hover:bg-red-50 transition"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Promotion card rendered inline in the feed. It's "launched" here; editing happens
// only via the Promotion Cards modal, so the feed only offers Remove.
function PromoCard({ promo, onRemove }: { promo: PromotionCard; onRemove: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group/promo relative rounded-lg py-6 px-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mx-auto w-[393px]">
        <div className="flex items-center justify-between mb-2 min-h-9">
          <span className="text-sm text-subtle">Promotion Card</span>
          <div className={`flex items-center gap-1.5 transition ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <IconBtn tooltip="Remove from feed" danger onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              <TrashIcon className="w-4 h-4" />
            </IconBtn>
          </div>
        </div>
        <PromotionCardPreview title={promo.title} description={promo.description} imageURL={promo.imageURL} />
      </div>
    </div>
  );
}

const AdSenseGlyph = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 3 19h6l3-6 3 6h6L12 3Z" fill="#fbbc04" />
    <circle cx="6" cy="19" r="2.4" fill="#4285f4" />
  </svg>
);

function statusLabel(s: StatusFilter): string {
  return { all: "All statuses", pending: "Pending", published: "Published", rejected: "Rejected", draft: "Draft" }[s];
}

// re-exported so BlogDetail can type the actions object
export type { PostKind };
