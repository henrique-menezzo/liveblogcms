"use client";

import type { LiveBlogSummary } from "@/lib/types";
import { Button } from "./ui";

export interface ConfigState {
  title: string;
  slug: string;
  articleID: number | null;
  requirePostApprovals: boolean;
  allowPostApprovalBypass: boolean;
}

// §4 Config Tab — title, slug, linked article, scheduling, require approvals,
// allow approval bypass (only when approvals required). PID is static/not editable.
export function SettingsTab({
  blog,
  config,
  onChange,
}: {
  blog: LiveBlogSummary;
  config: ConfigState;
  onChange: (c: ConfigState) => void;
}) {
  const set = (patch: Partial<ConfigState>) => onChange({ ...config, ...patch });

  return (
    <div className="flex-1 overflow-y-auto scroll-thin">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">General</h2>

          <Field label="PID" hint="Static identifier — not editable">
            <input
              value={blog.pid}
              disabled
              className="w-full rounded-md border border-line bg-zinc-100 px-3 py-2 text-sm text-subtle"
            />
          </Field>

          <Field label="Title" required>
            <input
              value={config.title}
              onChange={(e) => set({ title: e.target.value })}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </Field>

          <Field label="Slug" required>
            <div className="flex items-center rounded-md border border-line bg-white overflow-hidden">
              <span className="px-3 py-2 text-sm text-subtle bg-zinc-50 border-r border-line">/live-blog/</span>
              <input
                value={config.slug}
                onChange={(e) => set({ slug: e.target.value })}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </Field>

          <Field label="Linked Article ID" hint="Article this live blog is embedded in">
            <input
              type="number"
              value={config.articleID ?? ""}
              onChange={(e) => set({ articleID: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 12345"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">Scheduling</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Go live at">
              <input type="datetime-local" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
            </Field>
            <Field label="Unpublish at">
              <input type="datetime-local" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-subtle">Moderation</h2>

          <Toggle
            label="Require post approvals"
            description="Posts must be reviewed by an editor before publishing."
            checked={config.requirePostApprovals}
            onChange={(v) =>
              set({
                requirePostApprovals: v,
                // Bypass only meaningful when approvals are required (§3).
                allowPostApprovalBypass: v ? config.allowPostApprovalBypass : false,
              })
            }
          />

          {config.requirePostApprovals && (
            <Toggle
              label="Allow approval bypass"
              description="Writers may publish a pending post without approval (status → Bypassed)."
              checked={config.allowPostApprovalBypass}
              onChange={(v) => set({ allowPostApprovalBypass: v })}
            />
          )}
        </section>

        <div className="flex justify-end gap-2 pt-2 border-t border-line">
          <Button variant="outline">CANCEL</Button>
          <Button variant="primary">SAVE CHANGES</Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-subtle mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 text-left rounded-md border border-line bg-white px-4 py-3 hover:bg-zinc-50"
    >
      <span
        className={`mt-0.5 w-9 h-5 rounded-full p-0.5 shrink-0 transition ${
          checked ? "bg-ink" : "bg-zinc-300"
        }`}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-subtle">{description}</span>
      </span>
    </button>
  );
}
