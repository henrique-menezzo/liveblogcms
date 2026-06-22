import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Button, StatusBadge } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
import { LIVE_BLOGS } from "@/lib/mock-data";

// §4 — Live Blog List (/live-blogs)
// "Paginated list of all non-deleted live blogs. Displays title, created date,
//  scheduled live/unpublish times, publish status, post count, and indicator for
//  posts awaiting approval. Includes quick-access controls and a create button."

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function LiveBlogListPage() {
  return (
    <div className="min-h-screen">
      <TopBar crumbs={[{ label: "Live Blogs" }]} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Live Blogs</h1>
            <p className="text-sm text-subtle mt-1">
              {LIVE_BLOGS.length} live blogs
            </p>
          </div>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4" /> New Live Blog
          </Button>
        </div>

        <div className="bg-white border border-line rounded-lg shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-subtle border-b border-line bg-zinc-50">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Live / Unpublish</th>
                <th className="px-4 py-3 font-medium text-center">Posts</th>
                <th className="px-4 py-3 font-medium text-center">Awaiting</th>
              </tr>
            </thead>
            <tbody>
              {LIVE_BLOGS.map((b) => (
                <tr key={b.pid} className="border-b border-line last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link href={`/live-blogs/${b.pid}`} className="font-medium hover:underline line-clamp-1">
                      {b.title}
                    </Link>
                    <div className="text-xs text-subtle mt-0.5">/{b.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status.mid} />
                  </td>
                  <td className="px-4 py-3 text-subtle whitespace-nowrap">{fmtDate(b.createdAt)}</td>
                  <td className="px-4 py-3 text-subtle whitespace-nowrap">
                    <div>{fmtDate(b.publishedAt)}</div>
                    <div className="text-xs">{b.unpublishedAt ? `→ ${fmtDate(b.unpublishedAt)}` : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{b.postCount}</td>
                  <td className="px-4 py-3 text-center">
                    {b.pendingApprovalCount > 0 ? (
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-orange-50 text-warning text-xs font-semibold border border-orange-200">
                        {b.pendingApprovalCount}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
