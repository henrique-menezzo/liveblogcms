import Link from "next/link";
import { ChevronDown } from "./icons";
import { Avatar } from "./ui";

// Global app chrome: breadcrumb (left) · DAILYWIRE wordmark (center) · user (right).
export function TopBar({ crumbs }: { crumbs?: { label: string; href?: string }[] }) {
  return (
    <header className="h-[53px] bg-topbar border-b border-black/5 flex items-center px-4 sticky top-0 z-30">
      <nav className="flex items-center gap-2 text-sm min-w-0 flex-1">
        {crumbs?.map((c, i) => (
          <span key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span className="text-zinc-300">/</span>}
            {c.href ? (
              <Link href={c.href} className="text-subtle hover:text-ink truncate">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink truncate max-w-[260px]">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <Link href="/live-blogs" className="font-bold tracking-[0.12em] text-base">
        <span className="mr-1">≣</span> DAILYWIRE
      </Link>

      <div className="flex-1 flex items-center justify-end">
        <button className="flex items-center gap-2 text-sm text-ink hover:bg-zinc-50 rounded-md px-2 py-1">
          <Avatar name="Paul Snyder" size={24} />
          <span className="hidden sm:block">Paul Snyder</span>
          <ChevronDown className="w-4 h-4 text-subtle" />
        </button>
      </div>
    </header>
  );
}
