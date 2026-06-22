"use client";

import { useState } from "react";
import { Avatar, Button } from "./ui";
import { ChevronDown, CloseIcon, LinkIcon, UploadIcon } from "./icons";
import { AUTHORS, CURRENT_USER_PID } from "@/lib/mock-data";

export interface ComposerState {
  authorPID: string;
  title: string;
  body: string;
  embedUrl: string;
}

const TITLE_MAX = 140;

// Left "New Post" panel from the Figma — author, title, media, body, actions.
export function PostComposer({
  value,
  onChange,
  requireApproval,
  onClear,
  mode = "new",
}: {
  value: ComposerState;
  onChange: (v: ComposerState) => void;
  requireApproval: boolean;
  onClear: () => void;
  mode?: "new" | "edit";
}) {
  const isEdit = mode === "edit";
  const set = (patch: Partial<ComposerState>) => onChange({ ...value, ...patch });
  const [authorOpen, setAuthorOpen] = useState(false);

  const selected = AUTHORS.find((a) => a.pid === value.authorPID);
  const selectedLabel = selected
    ? selected.pid === CURRENT_USER_PID
      ? "You (Host)"
      : selected.name
    : null;

  return (
    <div className="border-r border-line flex flex-col min-h-0 bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h2 className="text-base font-semibold">{isEdit ? "Edit Post" : "New Post"}</h2>
        <button onClick={onClear} className="text-subtle hover:text-ink" aria-label="Clear">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

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
                  <Avatar name={selected.name} size={28} />
                  <span className="text-black">{selectedLabel}</span>
                </>
              ) : (
                <span className="text-subtle py-[5px]">e.g Matt Walsh</span>
              )}
              <ChevronDown className="w-4 h-4 text-subtle ml-auto" />
            </button>

            {authorOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-line bg-white shadow-lg py-1">
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
                    <Avatar name={a.name} size={24} />
                    <span>{a.pid === CURRENT_USER_PID ? "You (Host)" : a.name}</span>
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

        {/* Add Media */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-label">Add Media (optional)</label>
          <div className="rounded border border-dashed border-[#b8b8b8] bg-white px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-zinc-400 transition">
            <UploadIcon className="w-5 h-5 text-label mb-2" />
            <span className="text-xs font-medium text-label">Upload image or video</span>
          </div>

          <div className="flex items-center gap-3 my-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-sm font-medium text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="relative">
            <LinkIcon className="w-4 h-4 text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={value.embedUrl}
              onChange={(e) => set({ embedUrl: e.target.value })}
              placeholder="Paste a Twitter/X or Youtube video link..."
              className="w-full rounded border border-line bg-white pl-9 pr-3 py-2 text-sm placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-label">
            Body <span className="text-danger">*</span>
          </label>
          {/* Prototype: plain editor. §9 leaves the WYSIWYG choice (TipTap/Lexical/Quill) open. */}
          <div className="rounded border border-line bg-white overflow-hidden">
            <div className="flex items-center gap-1 border-b border-line px-2 py-1.5 text-subtle">
              <ToolbarBtn label="B" className="font-bold" />
              <ToolbarBtn label="I" className="italic" />
              <ToolbarBtn label="U" className="underline" />
              <span className="w-px h-4 bg-line mx-1" />
              <ToolbarBtn label="❝" />
              <ToolbarBtn label="• List" />
              <ToolbarBtn label="🔗" />
            </div>
            <textarea
              value={value.body}
              onChange={(e) => set({ body: e.target.value })}
              placeholder="Enter post body content..."
              rows={5}
              className="w-full resize-none px-3 py-2 text-sm placeholder:text-subtle focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-line">
        <Button variant="danger" onClick={onClear}>
          CANCEL
        </Button>
        {isEdit ? (
          <Button variant="primary" className="flex-1">
            SAVE CHANGES
          </Button>
        ) : (
          <>
            <Button variant="outlineDark" className="flex-1">
              SAVE DRAFT
            </Button>
            <Button variant="primary" className="flex-1">
              {requireApproval ? "SUBMIT TO REVIEW" : "PUBLISH"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ToolbarBtn({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      className={`min-w-7 h-7 px-1.5 rounded text-xs hover:bg-zinc-100 ${className}`}
    >
      {label}
    </button>
  );
}
