import type { Author, LiveBlogSummary, Post } from "./types";

// Status name lookup (§2 statuses table)
export const STATUS_NAME: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  unpublished: "Unpublished",
  live: "Live",
};

export const REVIEW_STATUS_NAME: Record<string, string> = {
  pending: "Pending",
  bypassed: "Bypassed",
  approved: "Approved",
  rejected: "Rejected",
};

export const AUTHORS: Author[] = [
  { pid: "a-1", name: "Paul Snyder", title: "Host" },
  { pid: "a-2", name: "Matt Walsh", title: "Host" },
  { pid: "a-3", name: "Linda Salt", title: "Staff Writer" },
  { pid: "a-4", name: "Jim Baker", title: "Contributor" },
];

// The signed-in CMS user. You can EDIT your own posts; as an editor you can also
// REVIEW (approve/reject/publish) other people's posts without editing their content.
export const CURRENT_USER_PID = "a-1";

// Demo permission model (see §3). "editor" can review others' posts; "writer" cannot.
export const CURRENT_ROLE: "writer" | "editor" = "editor";

const CURRENT_USER = { pid: "a-1", firstName: "Paul", lastName: "Snyder" };

export const LIVE_BLOGS: LiveBlogSummary[] = [
  {
    pid: "iran-deal-2026",
    slug: "us-officials-drop-hints-iran-deal",
    title: "U.S. Officials Drop Hints About What's Inside Iran Deal As Talks Continue",
    status: { mid: "draft", name: "Draft" },
    createdAt: "2024-10-27T23:58:53",
    createdBy: CURRENT_USER,
    publishedAt: null,
    unpublishedAt: null,
    articleID: 12345,
    postCount: 10,
    pendingApprovalCount: 10,
  },
  {
    pid: "election-night-live",
    slug: "election-night-live",
    title: "Election Night 2026 — Live Results & Reaction",
    status: { mid: "live", name: "Live" },
    createdAt: "2026-06-15T18:00:00",
    createdBy: { pid: "a-2", firstName: "Matt", lastName: "Walsh" },
    publishedAt: "2026-06-15T19:00:00",
    unpublishedAt: null,
    articleID: 22221,
    postCount: 48,
    pendingApprovalCount: 3,
  },
  {
    pid: "scotus-ruling",
    slug: "scotus-major-ruling",
    title: "SCOTUS Issues Major Ruling — Live Analysis",
    status: { mid: "published", name: "Published" },
    createdAt: "2026-05-02T09:30:00",
    createdBy: { pid: "a-3", firstName: "Linda", lastName: "Salt" },
    publishedAt: "2026-05-02T10:00:00",
    unpublishedAt: "2026-05-03T10:00:00",
    articleID: 33330,
    postCount: 27,
    pendingApprovalCount: 0,
  },
  {
    pid: "border-crisis",
    slug: "border-crisis-updates",
    title: "Border Crisis: Ongoing Updates From The Field",
    status: { mid: "unpublished", name: "Unpublished" },
    createdAt: "2026-04-11T12:00:00",
    createdBy: { pid: "a-4", firstName: "Jim", lastName: "Baker" },
    publishedAt: null,
    unpublishedAt: null,
    articleID: null,
    postCount: 4,
    pendingApprovalCount: 0,
  },
];

export const POSTS: Post[] = [
  {
    pid: "p-1",
    title: "The One Line In Iran's Proposal That Made Trump 'Throw It Away'",
    body: "Negotiators say a single clause buried in the draft proposal was enough to derail the entire framework, according to two officials familiar with the talks.",
    authors: [{ pid: "a-1", name: "Paul Snyder", isPrimary: true }],
    status: { mid: "published", name: "Published" },
    reviewStatus: "approved",
    publishedAt: "2026-06-17T22:15:00",
    createdAt: "2026-06-17T22:15:00",
    relativeTime: "3 min ago",
    pinned: true,
    mediaURL:
      "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&w=900&q=60",
  },
  {
    pid: "p-2",
    title: "State Department Briefing Wraps Without New Details",
    body: "The spokesperson declined to confirm whether a follow-up session has been scheduled.",
    authors: [{ pid: "a-3", name: "Linda Salt", isPrimary: true }],
    status: { mid: "published", name: "Published" },
    reviewStatus: "approved",
    publishedAt: "2026-06-17T21:40:00",
    createdAt: "2026-06-17T21:40:00",
    relativeTime: "38 min ago",
  },
  {
    pid: "p-3",
    title: "Sources: Sanctions Relief Still The Sticking Point",
    body: "Both sides remain far apart on the sequencing of sanctions relief, multiple sources tell The Daily Wire.",
    authors: [{ pid: "a-2", name: "Matt Walsh", isPrimary: true }],
    status: { mid: "draft", name: "Draft" },
    reviewStatus: "pending",
    publishedAt: null,
    createdAt: "2026-06-17T21:10:00",
    relativeTime: "1 hr ago",
  },
  {
    pid: "p-4",
    title: "Allies Watching Closely As Deadline Approaches",
    body: "European partners have signaled they will not extend the current timeline a second time.",
    authors: [{ pid: "a-4", name: "Jim Baker", isPrimary: true }],
    status: { mid: "draft", name: "Draft" },
    reviewStatus: "pending",
    publishedAt: null,
    createdAt: "2026-06-17T20:30:00",
    relativeTime: "2 hr ago",
  },
];
