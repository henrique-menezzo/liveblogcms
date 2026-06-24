import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { AuthorDetail } from "@/components/AuthorDetail";
import { AUTHORS } from "@/lib/mock-data";

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ pid: a.pid }));
}

// §4 — Author Details (/authors/{authorPID}) with tabs: Meta Data, Media, Scheduling.
export default function AuthorDetailPage({ params }: { params: { pid: string } }) {
  const author = AUTHORS.find((a) => a.pid === params.pid);
  if (!author) notFound();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar crumbs={[{ label: "Authors", href: "/authors" }, { label: author.name }]} />
      <AuthorDetail author={author} />
    </div>
  );
}
