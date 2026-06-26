"use client";

import { useState } from "react";
import { Avatar, Button, EditorStatusBadge } from "./ui";
import { CalendarIcon, ChevronDown, CloseIcon, TrashIcon } from "./icons";
import { RichTextEditor } from "./RichTextEditor";
import { PendingFor } from "./PendingFor";
import { AUTHORS, CURRENT_USER_PID } from "@/lib/mock-data";
import { formatScheduleBadge, type PostKind } from "@/lib/post-helpers";

export interface ComposerState {
  authorPID: string;
  title: string;
  body: string; // rich-text HTML
  scheduledFor?: string; // datetime-local value ("YYYY-MM-DDTHH:mm")
}

const TITLE_MAX = 140;

// Left editor panel. In "new" mode the header reads "New Post"; in "edit" mode it
// reads "Edit Post: #190" with the post's status badge inline (per Figma).
export function PostComposer({
  value,
  onChange,
  onClose,
  mode = "new",
  postNumber,
  kind,
  pendingSince,
  savedScheduledFor,
  canSchedule,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDelete,
}: {
  value: ComposerState;
  onChange: (v: ComposerState) => void;
  onClose: () => void;
  mode?: "new" | "edit";
  postNumber?: number;
  kind?: PostKind | null;
  pendingSince?: string | null;
  savedScheduledFor?: string | null;
  canSchedule?: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  onDelete?: () => void;
}) {
  const isEdit = mode === "edit";
  const set = (patch: Partial<ComposerState>) => onChange({ ...value, ...patch });
  const [authorOpen, setAuthorOpen] = useState(false);

  const selected = AUTHORS.find((a) => a.pid === value.authorPID);
  const authorLabel = (pid: string, name: string, title?: string | null) =>
    pid === CURRENT_USER_PID ? `${name} (You)` : title ? `${name} (${title})` : name;

  return (
    <div className="h-full w-full border-r border-line flex flex-col min-h-0 bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">
            {isEdit ? `Edit Post: #${postNumber}` : "New Post"}
          </h2>
          {isEdit && kind && (
            <EditorStatusBadge
              kind={kind}
              scheduledFor={kind === "scheduled" && savedScheduledFor ? formatScheduleBadge(savedScheduledFor) : undefined}
            />
          )}
        </div>
        <button onClick={onClose} className="text-subtle hover:text-ink" aria-label="Close">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Pending-for indicator */}
      {isEdit && kind === "pending" && pendingSince && (
        <div className="px-5 pt-3">
          <PendingFor since={pendingSince} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        {/* Author */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-label">
            Author <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAuthorOpen((v) => !v)}
              onBlur={() => setTimeout(() => setAuthorOpen(false), 120)}
              className="w-full flex items-center gap-2 rounded border border-line bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            >
              {selected ? (
                <>
                  <Avatar name={selected.name} src={selected.imageURL} size={28} />
                  <span className="text-black">{authorLabel(selected.pid, selected.name, selected.title)}</span>
                </>
              ) : (
                <span className="text-subtle py-[5px]">e.g Ben Shapiro</span>
              )}
              <ChevronDown className="w-4 h-4 text-subtle ml-auto" />
            </button>

            {authorOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-line bg-white shadow-lg py-1 max-h-56 overflow-y-auto">
                {AUTHORS.map((a) => (
                  <button
                    key={a.pid}
                    type="button"
                    onMouseDown={() => {
                      set({ authorPID: a.pid });
                      setAuthorOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-sm hover:bg-zinc-50 text-left"
                  >
                    <Avatar name={a.name} src={a.imageURL} size={24} />
                    <span>{authorLabel(a.pid, a.name, a.title)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-label">
            Title <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <textarea
              value={value.title}
              maxLength={TITLE_MAX}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="Enter post title..."
              rows={3}
              className="w-full resize-none rounded border border-line bg-white px-3 py-2 text-sm placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted">
              {value.title.length}/{TITLE_MAX} characters
            </span>
          </div>
        </div>

        {/* Body — rich text */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-label">
            Body <span className="text-danger">*</span>
          </label>
          <RichTextEditor value={value.body} onChange={(html) => set({ body: html })} />
        </div>

        {/* Schedule */}
        {canSchedule && (
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-label">Schedule post (optional)</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="datetime-local"
                value={value.scheduledFor ?? ""}
                onChange={(e) => set({ scheduledFor: e.target.value })}
                className="w-full rounded border border-line bg-white pl-9 pr-3 h-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
              />
              {value.scheduledFor && (
                <button
                  type="button"
                  onClick={() => set({ scheduledFor: "" })}
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label="Clear schedule"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-line">
        {isEdit ? (
          <Button variant="danger" onClick={onDelete} className="gap-1.5">
            <TrashIcon className="w-4 h-4" />
            DELETE
          </Button>
        ) : (
          <Button variant="danger" onClick={onClose}>
            CANCEL
          </Button>
        )}
        <Button variant="outlineDark" className="flex-1" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
        <Button variant="primary" className="flex-1" onClick={onPrimary}>
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
