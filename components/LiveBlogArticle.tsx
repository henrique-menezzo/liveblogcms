"use client";

import { Avatar } from "./ui";
import { DotsIcon, MutedIcon, PinIcon } from "./icons";

// Faithful reproduction of the Figma "Live Blog Article" component (node 145:10266).
// Fixed 393px column, #fafafa surface, 12px radius, 32px vertical padding,
// 16px side padding on text, full-bleed media.
export function LiveBlogArticle({
  time,
  author,
  authorImage,
  title,
  body,
  mediaURL,
  pinned = false,
  placeholder = false,
  showMenuButton = false,
  onMenuClick,
  dark = false,
}: {
  time?: string;
  author?: string;
  authorImage?: string;
  title?: string;
  body?: string;
  mediaURL?: string;
  pinned?: boolean;
  placeholder?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  dark?: boolean;
}) {
  // body is rich-text HTML; treat tag-only/empty markup as "no body".
  const hasBody = !!body && body.replace(/<[^>]*>/g, "").trim().length > 0;
  const surface = dark ? "bg-[#0a0909]" : "bg-feed";
  const titleColor = title ? (dark ? "text-[#fafafa]" : "text-black") : "text-muted";
  const timeColor = dark ? "text-[#fafafa]" : "text-black";
  const metaColor = dark ? "text-[#8f8f8f]" : "text-[#5c5c5c]";
  const bodyColor = dark
    ? "text-zinc-300 [&_a]:text-blue-400"
    : "text-black [&_a]:text-blue-700";
  return (
    <article className={`relative w-[393px] ${surface} rounded-xl py-8 flex flex-col gap-6`}>
      {/* Kebab menu — visible whenever the parent decides actions are available */}
      {showMenuButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          className={`absolute top-5 right-4 z-10 grid place-items-center w-8 h-8 rounded-md border transition ${
            dark ? "border-[#333] bg-[#1f1f1f] text-zinc-200 hover:bg-[#2a2a2a]" : "border-line bg-white text-black hover:bg-zinc-50"
          }`}
          aria-label="Post actions"
        >
          <DotsIcon className="w-4 h-4" />
        </button>
      )}

      {/* Pinned indicator */}
      {pinned && (
        <div className="flex items-center gap-1 px-4 -mb-2">
          <PinIcon className={`w-[15px] h-[15px] ${metaColor}`} />
          <span className={`text-[11.5px] font-medium ${metaColor}`}>Pinned</span>
        </div>
      )}

      {/* Author / timestamp */}
      <div className="flex items-center gap-2 px-4">
        <Avatar name={author || "?"} src={authorImage} size={32} dark={dark} />
        <div className="leading-none">
          <div className={`text-xs font-medium leading-4 ${timeColor}`}>{time || "Just now"}</div>
          <div className={`text-xs font-normal leading-4 mt-0.5 ${metaColor}`}>
            {author || (placeholder ? "Fill an author" : "")}
          </div>
        </div>
      </div>

      {/* Title — 24px / 32px Medium */}
      <h3 className={`px-4 text-2xl font-medium leading-8 ${titleColor}`}>
        {title || (placeholder ? "Type the title..." : "")}
      </h3>

      {/* Full-bleed media */}
      {mediaURL ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaURL} alt="" className="w-full h-[218px] object-cover" />
          <span className="absolute top-3 right-3 grid place-items-center w-12 h-12 rounded-full bg-black/70 text-white">
            <MutedIcon className="w-5 h-5" />
          </span>
        </div>
      ) : placeholder && !hasBody ? (
        <p className="px-4 text-base font-normal leading-6 text-muted -mt-2">
          Write the body content...
        </p>
      ) : null}

      {/* Body — 16px / 24px Regular. Rich-text HTML from the editor. */}
      {hasBody && (
        <div
          className={`px-4 text-base font-normal leading-6 ${bodyColor} [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_img]:rounded-md [&_img]:my-2`}
          dangerouslySetInnerHTML={{ __html: body as string }}
        />
      )}

      {/* Show more */}
      {!placeholder && hasBody && (
        <div className="text-center">
          <button className={`text-sm font-normal underline ${metaColor}`}>Show more</button>
        </div>
      )}
    </article>
  );
}
