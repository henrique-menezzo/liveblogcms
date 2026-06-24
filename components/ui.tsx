import { CheckIcon, PencilIcon } from "./icons";
import type { ReviewStatusMID, StatusMID } from "@/lib/types";

// Status pill used across the list view, blog header, and post cards.
export function StatusBadge({ status }: { status: StatusMID }) {
  const map: Record<StatusMID, { label: string; cls: string; icon?: React.ReactNode }> = {
    draft: {
      label: "Draft",
      cls: "bg-canvas text-black border border-line",
      icon: <PencilIcon className="w-3 h-3" />,
    },
    published: {
      label: "Published",
      cls: "bg-successBg text-black border border-green-300",
      icon: <CheckIcon className="w-3 h-3" />,
    },
    live: {
      label: "Live",
      cls: "bg-red-50 text-danger border border-red-200",
      icon: <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />,
    },
    unpublished: {
      label: "Unpublished",
      cls: "bg-zinc-100 text-subtle border border-zinc-200",
    },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-3 py-1 text-sm font-semibold ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

// Status badge used by the editor flows (Figma): a post is one of the 4 kinds.
// Pending = peach, Published = green, Rejected = pink, Draft = neutral.
// For pending posts a `pendingFor` string renders as "Pending: 3h ago".
export function EditorStatusBadge({
  kind,
  pendingFor,
  scheduledFor,
}: {
  kind: "pending" | "published" | "rejected" | "draft" | "scheduled";
  pendingFor?: string;
  scheduledFor?: string;
}) {
  if (scheduledFor) {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-[#92c0dd] text-[#0a0909]">
        {scheduledFor}
      </span>
    );
  }
  const map = {
    pending: {
      label: pendingFor ? `Pending: ${pendingFor}` : "Pending",
      cls: "bg-[#fde6c7] text-[#9a5a00]",
    },
    published: { label: "Published", cls: "bg-[#bbf7d0] text-[#05603a]" },
    rejected: { label: "Rejected", cls: "bg-[#fbd5d5] text-[#b42318]" },
    draft: { label: "Draft", cls: "bg-canvas text-subtle border border-line" },
    scheduled: { label: "Scheduled", cls: "bg-[#92c0dd] text-[#0a0909]" },
  }[kind];
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${map.cls}`}>
      {map.label}
    </span>
  );
}

export function ReviewBadge({ status }: { status: ReviewStatusMID }) {
  if (!status) return null;
  const map: Record<string, string> = {
    pending: "bg-orange-50 text-warning border border-orange-200",
    approved: "bg-successBg text-success border border-green-200",
    rejected: "bg-red-50 text-danger border border-red-200",
    bypassed: "bg-zinc-100 text-subtle border border-zinc-200",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium ${map[status]}`}>
      {label}
    </span>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "publish" | "outline" | "outlineDark" | "ghost" | "danger";
};

// Button styling mirrors Figma exactly: 12px semibold uppercase, 4px radius.
export function Button({ variant = "outline", className = "", ...props }: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded px-4 py-2 text-xs font-semibold uppercase tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:bg-black/90", // Submit to review
    publish: "bg-black/50 text-white hover:bg-black/60", // Publish now (50% black in Figma)
    outline: "border border-line bg-white text-black hover:bg-zinc-50", // Preview / Save
    outlineDark: "border border-black bg-white text-black hover:bg-zinc-50", // Save draft
    ghost: "text-black hover:bg-zinc-100",
    danger: "border border-danger text-danger bg-white hover:bg-red-50", // Cancel
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Avatar({ name, src, size = 32, dark = false }: { name: string; src?: string; size?: number; dark?: boolean }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-[11px] font-semibold overflow-hidden shrink-0 ${
        dark ? "bg-[#292929] text-zinc-300" : "bg-zinc-200 text-zinc-600"
      }`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
