"use client";

import { useEffect, useMemo, useState } from "react";
import type { LiveBlogSummary, Post } from "@/lib/types";
import { Button, StatusBadge } from "./ui";
import { PostComposer, type ComposerState } from "./PostComposer";
import { PostFeed, type PostActions } from "./PostFeed";
import { SettingsTab } from "./SettingsTab";
import { PromotionCardModal } from "./PromotionCardModal";
import { CodeIcon, UserIcon } from "./icons";
import { useToast } from "./Toast";
import { AUTHORS, CURRENT_USER_PID } from "@/lib/mock-data";
import { canManagePost, getPostKind, nowISO, type Ad, type PromotionCard, type Role } from "@/lib/post-helpers";

type Tab = "posts" | "settings";

const EMPTY_COMPOSER: ComposerState = {
  authorPID: CURRENT_USER_PID,
  title: "",
  body: "",
};

export function BlogDetail({ blog, initialPosts }: { blog: LiveBlogSummary; initialPosts: Post[] }) {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [composer, setComposer] = useState<ComposerState>(EMPTY_COMPOSER);
  // Two distinct "left panel" modes: composing a brand-new post, or editing a
  // focused existing one. Exactly one is active at a time.
  const [composingNew, setComposingNew] = useState(true);
  const [focusedPid, setFocusedPid] = useState<string | null>(null);
  // The left editor panel can be collapsed (to enlarge the feed) and resized by
  // dragging its right edge. It reopens on New Post / clicking a post / Edit.
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(481);
  // Experience toggle: editors publish/approve directly; reporters submit for review.
  const [role, setRole] = useState<Role>("editor");
  const canReview = role === "editor";
  // AdSense slots inserted between posts.
  const [ads, setAds] = useState<Ad[]>([]);
  const insertAd = (afterPid: string | null) => {
    setAds((prev) => [...prev, { id: `ad-${Date.now()}`, afterPid }]);
    toast("Ad slot inserted");
  };
  const removeAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
    toast("Ad slot removed");
  };
  // Promotion cards: a saved library; cards are "posted" into the feed separately.
  type PromoData = { name: string; title: string; description: string; imageURL: string };
  const [promos, setPromos] = useState<PromotionCard[]>([]);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const saveNewPromo = (data: PromoData) => {
    setPromos((prev) => [...prev, { id: `promo-${Date.now()}`, inFeed: false, afterPid: null, ...data }]);
    toast("Promotion card saved");
  };
  const saveEditPromo = (id: string, data: PromoData) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    toast("Promotion card updated");
  };
  const postPromo = (id: string) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, inFeed: true, afterPid: focusedPid } : p)));
    setPromoModalOpen(false);
    toast("Promotion card posted");
  };
  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    toast("Promotion card deleted");
  };
  const removeFeedPromo = (id: string) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, inFeed: false } : p)));
    toast("Removed from feed");
  };
  const [config, setConfig] = useState({
    title: blog.title,
    slug: blog.slug,
    articleID: blog.articleID ?? null,
    requirePostApprovals: true,
    allowPostApprovalBypass: false,
  });

  const created = useMemo(
    () =>
      new Date(blog.createdAt).toLocaleString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      }),
    [blog.createdAt]
  );

  // Only a post the current role can manage drives the left editor. (A reporter
  // focusing someone else's post just highlights it — read-only.)
  const editingPost = useMemo(() => {
    if (!focusedPid) return null;
    const post = posts.find((p) => p.pid === focusedPid) ?? null;
    return post && canManagePost(post, canReview) ? post : null;
  }, [focusedPid, posts, canReview]);

  // Load focused post into the composer; blank it for a new post.
  useEffect(() => {
    if (editingPost) {
      setComposer({
        authorPID: editingPost.authors[0]?.pid ?? CURRENT_USER_PID,
        title: editingPost.title,
        body: editingPost.body,
      });
    } else {
      setComposer(EMPTY_COMPOSER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPost?.pid]);

  const updatePost = (pid: string, patch: Partial<Post>) =>
    setPosts((prev) => prev.map((p) => (p.pid === pid ? { ...p, ...patch } : p)));

  const focusPost = (pid: string | null) => {
    if (pid === null) {
      startNewPost();
      return;
    }
    setFocusedPid(pid);
    const post = posts.find((p) => p.pid === pid);
    // Open the editor only for posts this role can manage; otherwise just highlight.
    if (post && canManagePost(post, canReview)) {
      setPanelOpen(true);
      setComposingNew(false);
    }
  };

  const startNewPost = () => {
    setPanelOpen(true);
    setComposingNew(true);
    setFocusedPid(null);
    setComposer(EMPTY_COMPOSER);
  };

  // Collapse the panel and clear any selection so the feed gets the full width.
  const closePanel = () => {
    setPanelOpen(false);
    setComposingNew(false);
    setFocusedPid(null);
  };

  // Drag the panel's right edge to resize it (clamped 360–760px).
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = panelWidth;
    const onMove = (ev: MouseEvent) =>
      setPanelWidth(Math.min(760, Math.max(360, startW + ev.clientX - startX)));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
    };
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const closeAfter = (pid: string) => {
    if (focusedPid === pid) startNewPost();
  };

  // Editors publish directly; reporters can only submit for review (unless the blog
  // doesn't require approvals at all).
  const canPublishDirect = canReview || !config.requirePostApprovals;

  // Inline (icon / hover-pill) actions.
  const actions: PostActions = {
    onApprove: (post) => {
      updatePost(post.pid, {
        status: { mid: "published", name: "Published" },
        reviewStatus: "approved", publishedAt: nowISO(), relativeTime: "Just now",
      });
      toast("Post approved & published");
      closeAfter(post.pid);
    },
    onReject: (post) => {
      updatePost(post.pid, { reviewStatus: "rejected" });
      toast("Post Rejected");
      closeAfter(post.pid);
    },
    onDelete: (post) => {
      if (!window.confirm(`Delete Post #${post.postNumber}? This can't be undone.`)) return;
      setPosts((prev) => prev.filter((p) => p.pid !== post.pid));
      toast("Post deleted");
      closeAfter(post.pid);
    },
    onPin: (post) => {
      setPosts((prev) => prev.map((p) => ({ ...p, pinned: p.pid === post.pid })));
      toast("Pinned successfully!");
    },
    onUnpin: (post) => {
      updatePost(post.pid, { pinned: false });
      toast("Unpinned successfully!");
    },
  };

  const kind = editingPost ? getPostKind(editingPost) : null;

  const commit = (patch: Partial<Post>, message: string) => {
    const author = AUTHORS.find((a) => a.pid === composer.authorPID);
    const authors = author ? [{ pid: author.pid, name: author.name, isPrimary: true }] : editingPost?.authors ?? [];
    if (editingPost) {
      updatePost(editingPost.pid, { title: composer.title, body: composer.body, authors, ...patch });
    } else {
      const maxNum = posts.reduce((m, p) => Math.max(m, p.postNumber), 0);
      setPosts((prev) => [
        {
          pid: `p-${Date.now()}`,
          postNumber: maxNum + 1,
          title: composer.title,
          body: composer.body,
          authors,
          status: { mid: "draft", name: "Draft" },
          reviewStatus: null,
          publishedAt: null,
          createdAt: nowISO(),
          relativeTime: "Just now",
          ...patch,
        },
        ...prev,
      ]);
    }
    toast(message);
    startNewPost();
  };

  const onSecondary = () =>
    commit({ status: { mid: "draft", name: "Draft" }, reviewStatus: null, publishedAt: null }, "Saved as draft");

  const onPrimary = () => {
    if (canPublishDirect) {
      // Editor (or approvals disabled): publish / re-publish directly.
      commit(
        {
          status: { mid: "published", name: "Published" },
          reviewStatus: kind === "pending" ? "approved" : config.requirePostApprovals ? "bypassed" : "approved",
          publishedAt: nowISO(), relativeTime: "Just now",
        },
        "Post published"
      );
    } else {
      // Reporter: submit for review → pending.
      commit(
        { status: { mid: "draft", name: "Draft" }, reviewStatus: "pending", publishedAt: null, relativeTime: "Just now", pendingSince: nowISO() },
        "Submitted for review"
      );
    }
  };

  // Primary button label, role- and status-aware (Figma).
  const primaryLabel = !canPublishDirect
    ? "SUBMIT TO REVIEW"
    : !editingPost
    ? "PUBLISH"
    : kind === "rejected"
    ? "EDIT AND PUBLISH"
    : "SAVE AND PUBLISH";
  const secondaryLabel = "SAVE AS DRAFT";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-canvas">
      <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-lg p-6 gap-6">
        {/* Blog header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-12 rounded bg-zinc-900 shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 grid place-items-center text-[9px] font-bold text-white leading-tight text-center">
              Live<br />Blog
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={blog.status.mid} />
              <span className="flex items-center gap-1.5 text-xs text-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                Upcoming
              </span>
            </div>
            <h1 className="text-2xl font-semibold leading-snug pr-4 line-clamp-2 text-ink">{blog.title}</h1>
            <div className="flex items-center gap-2 text-xs text-subtle mt-1">
              <span>Created: {created}</span>
              <span className="text-zinc-300">|</span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                By {blog.createdBy.firstName} {blog.createdBy.lastName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="px-3"><CodeIcon className="w-4 h-4" /></Button>
            <Button variant="outline">PREVIEW</Button>
            <Button variant="outline">SAVE AS DRAFT</Button>
            <Button variant="publish">PUBLISH NOW</Button>
          </div>
        </div>

        {/* Body card */}
        <div className="flex-1 flex flex-col min-h-0 border border-line rounded-lg overflow-hidden">
          <div className="flex items-stretch border-b border-line shrink-0">
            {(["posts", "settings"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-6 py-4 text-xs uppercase tracking-[0.04em] transition ${
                  tab === t ? "font-semibold text-black" : "font-medium text-black/70 hover:text-black"
                }`}
              >
                {t}
                {t === "posts" && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#fde6c7] text-[#9a5a00] text-[11px] font-semibold align-middle">
                    {posts.length}
                  </span>
                )}
                {tab === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-black" />}
              </button>
            ))}

            {/* Experience toggle: Editor / Reporter */}
            <div className="ml-auto flex items-center gap-2 pr-4 self-center">
              <span className="text-[11px] uppercase tracking-wide text-muted">Experience</span>
              <div className="inline-flex rounded-lg border border-line bg-canvas p-0.5">
                {(["editor", "reporter"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                      role === r ? "bg-white text-black shadow-sm" : "text-subtle hover:text-black"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {tab === "posts" ? (
            <div className="flex-1 flex min-h-0">
              {panelOpen && (
                <>
                  <div style={{ width: panelWidth }} className="shrink-0 min-h-0">
                    <PostComposer
                      value={composer}
                      onChange={setComposer}
                      onClose={closePanel}
                      mode={editingPost ? "edit" : "new"}
                      postNumber={editingPost?.postNumber}
                      kind={kind}
                      pendingSince={editingPost?.pendingSince}
                      primaryLabel={primaryLabel}
                      onPrimary={onPrimary}
                      secondaryLabel={secondaryLabel}
                      onSecondary={onSecondary}
                      onDelete={editingPost ? () => actions.onDelete(editingPost) : undefined}
                    />
                  </div>
                  {/* Drag handle to resize the panel */}
                  <div
                    onMouseDown={startDrag}
                    className="group relative w-1.5 shrink-0 cursor-col-resize bg-line/40 hover:bg-black/20 transition"
                    title="Drag to resize"
                  >
                    <span className="absolute inset-y-0 -left-1 -right-1" />
                  </div>
                </>
              )}
              <div className="flex-1 min-w-0 min-h-0">
                <PostFeed
                  posts={posts}
                  preview={composer}
                  composingNew={panelOpen && composingNew}
                  focusedPid={focusedPid}
                  onFocus={focusPost}
                  onNewPost={startNewPost}
                  actions={actions}
                  canReview={canReview}
                  ads={ads}
                  onInsertAd={insertAd}
                  onRemoveAd={removeAd}
                  promos={promos}
                  onAddPromo={() => setPromoModalOpen(true)}
                  onRemovePromo={removeFeedPromo}
                />
              </div>
            </div>
          ) : (
            <SettingsTab blog={blog} config={config} onChange={setConfig} />
          )}
        </div>
      </div>

      {promoModalOpen && (
        <PromotionCardModal
          cards={promos}
          onClose={() => setPromoModalOpen(false)}
          onPost={postPromo}
          onSaveNew={saveNewPromo}
          onSaveEdit={saveEditPromo}
          onDelete={deletePromo}
        />
      )}
    </div>
  );
}
