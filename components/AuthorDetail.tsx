"use client";

import { useState } from "react";
import type { Author } from "@/lib/types";
import { Avatar, Button, StatusBadge } from "./ui";
import { UploadIcon } from "./icons";

type Tab = "meta-data" | "media" | "scheduling";

const TABS: { key: Tab; label: string }[] = [
  { key: "meta-data", label: "Meta Data" },
  { key: "media", label: "Media" },
  { key: "scheduling", label: "Scheduling" },
];

export function AuthorDetail({ author }: { author: Author }) {
  const [tab, setTab] = useState<Tab>("meta-data");
  const [name, setName] = useState(author.name);
  const [bio, setBio] = useState("");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="px-6 pt-5 border-b border-line">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={author.name} size={44} />
          <div>
            <h1 className="text-xl font-bold">{author.name}</h1>
            <StatusBadge status="published" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative pb-3 text-sm font-semibold uppercase tracking-wide ${
                tab === t.key ? "text-ink" : "text-subtle hover:text-ink"
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ink" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {tab === "meta-data" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Name <span className="text-danger">*</span></label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="Short biography..."
                  className="w-full resize-none rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">CANCEL</Button>
                <Button variant="primary">SAVE</Button>
              </div>
            </div>
          )}

          {tab === "media" && (
            <div className="space-y-4">
              <p className="text-sm text-subtle">Square 1×1 author image used for headshots.</p>
              <div className="flex items-center gap-4">
                <Avatar name={author.name} size={96} />
                <div className="rounded-md border-2 border-dashed border-line px-6 py-8 flex-1 flex flex-col items-center text-center cursor-pointer hover:border-zinc-300">
                  <UploadIcon className="w-5 h-5 text-subtle mb-2" />
                  <span className="text-xs text-subtle">Upload square author image</span>
                </div>
              </div>
            </div>
          )}

          {tab === "scheduling" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Publish at</label>
                <input type="datetime-local" className="w-full rounded-md border border-line px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Unpublish at</label>
                <input type="datetime-local" className="w-full rounded-md border border-line px-3 py-2 text-sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
