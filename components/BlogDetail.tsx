"use client";

import { useMemo, useState } from "react";
import type { LiveBlogSummary, Post } from "@/lib/types";
import { Button, StatusBadge } from "./ui";
import { PostComposer, type ComposerState } from "./PostComposer";
import { PostFeed } from "./PostFeed";
import { SettingsTab } from "./SettingsTab";
import { UserIcon } from "./icons";
import { CURRENT_USER_PID } from "@/lib/mock-data";

type Tab = "posts" | "settings";

const EMPTY_COMPOSER: ComposerState = {
  authorPID: CURRENT_USER_PID, // defaults to the signed-in host
  title: "",
  body: "",
  embedUrl: "",
};

export function BlogDetail({
  blog,
  initialPosts,
}: {
  blog: LiveBlogSummary;
  initialPosts: Post[];
}) {
  const [tab, setTab] = useState<Tab>("posts");
  const [composer, setComposer] = useState<ComposerState>(EMPTY_COMPOSER);
  const [editingId, setEditingId] = useState<string | null>(null);
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
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [blog.createdAt]
  );

  // Load a post into the left panel as "Edit Post" (when the user may edit it),
  // or reset back to a blank "New Post".
  const startEdit = (post: Post) => {
    setComposer({
      authorPID: post.authors[0]?.pid ?? CURRENT_USER_PID,
      title: post.title,
      body: post.body,
      embedUrl: post.embedUrl ?? "",
    });
    setEditingId(post.pid);
  };
  const resetComposer = () => {
    setComposer(EMPTY_COMPOSER);
    setEditingId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-canvas">
      <div className="flex-1 flex flex-col min-h-0 m-4 bg-white rounded-lg p-6 gap-6">
        {/* Blog header */}
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
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
            <Button variant="outline">PREVIEW</Button>
            <Button variant="outline">SAVE</Button>
            <Button variant="publish">PUBLISH NOW</Button>
          </div>
        </div>

        {/* Body card: tabs + two-column layout */}
        <div className="flex-1 flex flex-col min-h-0 border border-line rounded-lg overflow-hidden">
          {/* Tabs — 12px SemiBold uppercase, 4% letter-spacing */}
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
                {tab === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-black" />}
              </button>
            ))}
          </div>

          {/* Tab body */}
          {tab === "posts" ? (
            <div className="flex-1 grid grid-cols-[481px_1fr] min-h-0">
              <PostComposer
                value={composer}
                onChange={setComposer}
                requireApproval={config.requirePostApprovals}
                onClear={resetComposer}
                mode={editingId ? "edit" : "new"}
              />
              <PostFeed
                posts={initialPosts}
                preview={composer}
                editingId={editingId}
                onEditPost={(post) => (post ? startEdit(post) : resetComposer())}
              />
            </div>
          ) : (
            <SettingsTab blog={blog} config={config} onChange={setConfig} />
          )}
        </div>
      </div>
    </div>
  );
}
