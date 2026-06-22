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
}) {
  return (
    <article className="relative w-[393px] bg-feed rounded-xl py-8 flex flex-col gap-6">
      {/* Kebab menu — visible whenever the parent decides actions are available */}
      {showMenuButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          className="absolute top-5 right-4 z-10 grid place-items-center w-8 h-8 rounded-md border border-line bg-white text-black hover:bg-zinc-50 transition"
          aria-label="Post actions"
        >
          <DotsIcon className="w-4 h-4" />
        </button>
      )}

      {/* Pinned indicator */}
      {pinned && (
        <div className="flex items-center gap-1 px-4 -mb-2">
          <PinIcon className="w-[15px] h-[15px] text-[#5c5c5c]" />
          <span className="text-[11.5px] font-medium text-[#5c5c5c]">Pinned</span>
        </div>
      )}

      {/* Author / timestamp */}
      <div className="flex items-center gap-2 px-4">
        <Avatar name={author || "?"} src={authorImage} size={32} />
        <div className="leading-none">
          <div className="text-xs font-medium text-black leading-4">{time || "Just now"}</div>
          <div className="text-xs font-normal text-[#5c5c5c] leading-4 mt-0.5">
            {author || (placeholder ? "Fill an author" : "")}
          </div>
        </div>
      </div>

      {/* Title — 24px / 32px Medium */}
      <h3 className={`px-4 text-2xl font-medium leading-8 ${title ? "text-black" : "text-muted"}`}>
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
      ) : placeholder ? (
        <p className="px-4 text-base font-normal leading-6 text-muted -mt-2">
          Write the body content...
        </p>
      ) : null}

      {/* Body — 16px / 24px Regular */}
      {body && (
        <div className="px-4 text-base font-normal leading-6 text-black whitespace-pre-line">
          {body}
        </div>
      )}

      {/* Show more */}
      {!placeholder && body && (
        <div className="text-center">
          <button className="text-sm font-normal text-[#5c5c5c] underline">Show more</button>
        </div>
      )}
    </article>
  );
}
