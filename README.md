# DW Live Blog CMS — Front-end Prototype

A Next.js front-end prototype of the Daily Wire **Live Blog CMS**, built to match the
Figma reference screen (node `142:5747`) and implement the page/behavior requirements
from the [Live Blog Design Doc](https://bentkey.atlassian.net/wiki/spaces/BENTKEY/pages/1699446789/Live+Blog+Design+Doc).

> Prototype scope: front-end only, with mocked/in-memory data shaped to the §8 API
> contracts. No real backend, Redis, or middleware. The rich-text body is a simple
> editor stub (§9 leaves the WYSIWYG choice — TipTap/Lexical/Quill — open).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS.

## What maps to the design doc

| Design doc | Implemented as |
| --- | --- |
| §4 Live Blog List (`/live-blogs`) | `app/live-blogs/page.tsx` — title, created, scheduled live/unpublish, status, post count, awaiting-approval indicator, "New Live Blog" |
| §4 Live Blog Details + tabs (`/live-blogs/{pid}`) | `app/live-blogs/[pid]/page.tsx` + `components/BlogDetail.tsx` — header (status, title, created/author, Preview/Save/Publish) and Posts / Settings tabs |
| §4 Live/Posts tab | `components/PostComposer.tsx` (New Post: author, title w/ 140 counter, media upload, X/YouTube embed, body) + `components/PostFeed.tsx` (All/Your/Pending/Published filters, live preview card, published feed, draft approve/reject) |
| §4 Config tab | `components/SettingsTab.tsx` — title, slug, linked article, scheduling, require approvals, allow bypass (static PID) |
| §3 Review/Publish status model | `lib/types.ts` status & review enums; bypass toggle only shown when approvals required; status/review badges in `components/ui.tsx` |
| §4 Author pages (`/authors`, `/authors/{pid}`) | `app/authors/*` + `components/AuthorDetail.tsx` — list + Meta Data / Media / Scheduling tabs |
| §8 API contract shapes | `lib/types.ts` (`LiveBlogSummary`, `Post`, `Author`, status responses) |

## Key files

```
app/                 routes (live-blogs, authors)
components/          BlogDetail, PostComposer, PostFeed, SettingsTab, AuthorDetail, TopBar, ui, icons
lib/types.ts         types mirroring §8 Go structs
lib/mock-data.ts     sample live blogs, posts, authors
```
