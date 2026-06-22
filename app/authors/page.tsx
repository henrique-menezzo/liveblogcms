import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Avatar, Button, StatusBadge } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
import { AUTHORS } from "@/lib/mock-data";

// §4 — Author List (/authors)
// "Displays name, created date, scheduled publish/unpublish times, and status.
//  Quick-access status controls and a button to create a new author."
const AUTHOR_ROWS = AUTHORS.map((a, i) => ({
  ...a,
  createdAt: ["2026-01-12", "2025-11-03", "2026-03-21", "2026-02-08"][i],
  status: (i % 3 === 2 ? "unpublished" : "published") as "published" | "unpublished",
}));

export default function AuthorListPage() {
  return (
    <div className="min-h-screen">
      <TopBar crumbs={[{ label: "Authors" }]} />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Authors</h1>
            <p className="text-sm text-subtle mt-1">{AUTHOR_ROWS.length} authors</p>
          </div>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4" /> New Author
          </Button>
        </div>

        <div className="bg-white border border-line rounded-lg shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-subtle border-b border-line bg-zinc-50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {AUTHOR_ROWS.map((a) => (
                <tr key={a.pid} className="border-b border-line last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link href={`/authors/${a.pid}`} className="flex items-center gap-3 font-medium hover:underline">
                      <Avatar name={a.name} size={28} />
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-subtle">{a.title}</td>
                  <td className="px-4 py-3 text-subtle">
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
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
