"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

// Rich-text body editor matching the Figma toolbar: undo/redo · B I U S · Block type
// · super/subscript · lists, then a second row of embeds (link, image, YouTube, X).
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 393, height: 220 }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] px-3 py-2 focus:outline-none text-sm leading-6",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the editor in sync when the loaded post changes (focus switch / reset).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return <div className="rounded border border-line bg-white h-[200px]" />;
  }

  return (
    <div className="rounded border border-line bg-white overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };
  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };
  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };
  const addTweet = () => {
    const url = window.prompt("X / Twitter URL");
    if (url) editor.chain().focus().setLink({ href: url }).insertContent(` ${url} `).run();
  };

  return (
    <div className="border-b border-line">
      {/* Row 1 — formatting */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 text-subtle">
        <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="↶" />
        <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="↷" />
        <Sep />
        <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="B" cls="font-bold" />
        <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="I" cls="italic" />
        <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="U" cls="underline" />
        <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="S" cls="line-through" />
        <Sep />
        <select
          value={editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: v === "h2" ? 2 : 3 }).run();
          }}
          className="text-xs rounded border border-line bg-white px-2 py-1 mx-1 focus:outline-none"
        >
          <option value="p">Block type</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>
        <Sep />
        <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="•≡" />
        <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="1≡" />
      </div>
      {/* Row 2 — embeds */}
      <div className="flex items-center gap-1.5 px-2 pb-2">
        <EmbedBtn onClick={addLink} title="Link"><LinkGlyph /></EmbedBtn>
        <EmbedBtn onClick={addImage} title="Image"><ImageGlyph /></EmbedBtn>
        <EmbedBtn onClick={addYoutube} title="YouTube" className="bg-[#ff0000] text-white border-transparent"><YtGlyph /></EmbedBtn>
        <EmbedBtn onClick={addTweet} title="X" className="bg-black text-white border-transparent"><XGlyph /></EmbedBtn>
      </div>
    </div>
  );
}

function TBtn({ onClick, label, active, disabled, cls = "" }: { onClick: () => void; label: string; active?: boolean; disabled?: boolean; cls?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-w-7 h-7 px-1.5 rounded text-sm grid place-items-center hover:bg-zinc-100 disabled:opacity-30 ${active ? "bg-zinc-200 text-black" : ""} ${cls}`}
    >
      {label}
    </button>
  );
}

const Sep = () => <span className="w-px h-5 bg-line mx-1" />;

function EmbedBtn({ onClick, title, children, className = "" }: { onClick: () => void; title: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-9 h-9 grid place-items-center rounded-lg border border-line bg-white hover:bg-zinc-50 ${className}`}
    >
      {children}
    </button>
  );
}

const LinkGlyph = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const ImageGlyph = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" />
  </svg>
);
const YtGlyph = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4 0-1.3.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.5v1.3C2 13.5 2.2 15 2.2 15s.2 1.4.8 2c.7.8 1.7.8 2.1.9C6.7 18 12 18 12 18s4 0 6.8-.3c.4 0 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.7.2-3.4v-1.3c0-1.7-.2-3.9-.2-3.9ZM10 14.5v-5l4.2 2.5L10 14.5Z" /></svg>
);
const XGlyph = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23.3 22h-6.8l-5.3-7-6.1 7H2l7.8-8.9L1.3 2h7l4.8 6.3L18.9 2Zm-2.4 18h1.9L7.6 4H5.6l10.9 16Z" /></svg>
);
