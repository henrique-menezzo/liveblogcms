import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { BlogDetail } from "@/components/BlogDetail";
import { LIVE_BLOGS, POSTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return LIVE_BLOGS.map((b) => ({ pid: b.pid }));
}

// §4 — Live Blog Details (/live-blogs/{liveBlogPID})
// Tabs: Live/Posts (default), Analytics, Config. Title + status shown above tabs.
export default function LiveBlogDetailPage({
  params,
}: {
  params: { pid: string };
}) {
  const blog = LIVE_BLOGS.find((b) => b.pid === params.pid);
  if (!blog) notFound();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        crumbs={[
          { label: "Live Blog", href: "/live-blogs" },
          { label: blog.title },
        ]}
      />
      <BlogDetail blog={blog} initialPosts={POSTS} />
    </div>
  );
}
