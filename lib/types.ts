// Types mirror the CMS API contracts in §8 of the Live Blog Design Doc.
// Kept intentionally close to the Go structs so the prototype maps 1:1 to the spec.

export type StatusMID = "draft" | "published" | "unpublished" | "live";
export type ReviewStatusMID = "pending" | "bypassed" | "approved" | "rejected" | null;

export interface StatusResponse {
  mid: StatusMID;
  name: string;
}

export interface ResponseUser {
  pid: string;
  firstName: string;
  lastName: string;
}

// §8 — LiveBlogSummaryResponse
export interface LiveBlogSummary {
  pid: string;
  articleID?: number | null;
  createdAt: string;
  createdBy: ResponseUser;
  publishedAt?: string | null;
  slug: string;
  status: StatusResponse;
  title: string;
  updatedAt?: string | null;
  unpublishedAt?: string | null;
  // Surfaced in the list view (§4): post count + posts awaiting approval
  postCount: number;
  pendingApprovalCount: number;
  thumbnailURL?: string;
}

// §8 — Post in a live blog feed
export interface Author {
  pid: string;
  name: string;
  title?: string | null;
  imageURL?: string;
  isPrimary?: boolean;
}

export interface Post {
  pid: string;
  postNumber: number; // human-facing "Post #190" identifier shown in the editor
  title: string;
  body: string; // rich-text HTML (TipTap); spec leaves WYSIWYG JSON as TBD (§9)
  authors: Author[];
  embedUrl?: string | null;
  mediaURL?: string;
  status: StatusResponse;
  reviewStatus: ReviewStatusMID;
  publishedAt?: string | null;
  createdAt: string;
  relativeTime: string;
  pinned?: boolean;
  pendingSince?: string | null; // when the post entered review (drives "Pending for …")
  scheduledFor?: string | null; // future publish time (drives the "Scheduled" badge/filter)
}

// §3 — Live blog config that drives the review/publish state machine
export interface LiveBlogConfig {
  requirePostApprovals: boolean;
  allowPostApprovalBypass: boolean;
  slug: string;
  articleID?: number | null;
  title: string;
}
