"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

// Rich-text body editor matching the Figma toolbar (Tabler icon set): undo/redo ·
// B I U S · highlight · Block type · super/subscript · lists · link/image/YouTube/X.
// The toolbar is a single responsive bar: items stay on one line while there's room
// and wrap (group by group) onto further lines as the panel narrows.
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Superscript,
      Subscript,
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
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-line text-ink">
      {/* History */}
      <Group>
        <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <UndoIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <RedoIcon />
        </TBtn>
      </Group>

      <Sep />

      {/* Inline marks */}
      <Group>
        <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <BoldIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <ItalicIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <UnderlineIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <StrikeIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
          <BallpenIcon />
        </TBtn>
      </Group>

      <Sep />

      {/* Block type */}
      <select
        value={editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: v === "h2" ? 2 : 3 }).run();
        }}
        className="h-8 text-xs rounded border border-line bg-white px-2 focus:outline-none focus:ring-2 focus:ring-ink/10"
      >
        <option value="p">Block type</option>
        <option value="h2">Heading</option>
        <option value="h3">Subheading</option>
      </select>

      <Sep />

      {/* Super / sub */}
      <Group>
        <TBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript">
          <SuperscriptIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript">
          <SubscriptIcon />
        </TBtn>
      </Group>

      <Sep />

      {/* Lists */}
      <Group>
        <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <ListIcon />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          <ListNumbersIcon />
        </TBtn>
      </Group>

      <Sep />

      {/* Embeds */}
      <Group>
        <TBtn onClick={addLink} title="Link">
          <LinkIcon />
        </TBtn>
        <TBtn onClick={addImage} title="Image">
          <PhotoPlusIcon />
        </TBtn>
        <TBtn onClick={addYoutube} title="YouTube">
          <YoutubeIcon />
        </TBtn>
        <TBtn onClick={addTweet} title="X">
          <BrandXIcon />
        </TBtn>
      </Group>
    </div>
  );
}

// A non-shrinking cluster of buttons so whole groups wrap together as the bar narrows.
const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center shrink-0">{children}</div>
);

const Sep = () => <span className="w-px h-5 bg-line mx-1 shrink-0" />;

function TBtn({
  onClick,
  children,
  title,
  active,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`w-8 h-8 grid place-items-center rounded hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent ${
        active ? "bg-zinc-200 text-black" : "text-subtle"
      }`}
    >
      {children}
    </button>
  );
}

/* --- Tabler icons exported from Figma (20x20, stroke 1.5) --- */
type IP = { className?: string };
const Stroke = ({ d, className = "w-5 h-5" }: { d: string; className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const UndoIcon = (p: IP) => <Stroke {...p} d="M14.9998 15.0013V10.0013C14.9998 9.33826 14.7364 8.70238 14.2676 8.23353C13.7988 7.76469 13.1629 7.5013 12.4998 7.5013H4.1665M7.49984 10.8346L4.1665 7.5013L7.49984 4.16797" />;
const RedoIcon = (p: IP) => <Stroke {...p} d="M5 15.0013V10.0013C5 9.33826 5.26339 8.70238 5.73223 8.23353C6.20107 7.76469 6.83696 7.5013 7.5 7.5013H15.8333M12.5 10.8346L15.8333 7.5013L12.5 4.16797" />;
const BoldIcon = (p: IP) => <Stroke {...p} d="M10.8335 10.0013C11.607 10.0013 12.3489 9.69401 12.8959 9.14703C13.4429 8.60005 13.7502 7.85818 13.7502 7.08464C13.7502 6.31109 13.4429 5.56922 12.8959 5.02224C12.3489 4.47526 11.607 4.16797 10.8335 4.16797H5.8335V10.0013M10.8335 10.0013H5.8335M10.8335 10.0013H11.6668C12.4404 10.0013 13.1822 10.3086 13.7292 10.8556C14.2762 11.4026 14.5835 12.1444 14.5835 12.918C14.5835 13.6915 14.2762 14.4334 13.7292 14.9804C13.1822 15.5273 12.4404 15.8346 11.6668 15.8346H5.8335V10.0013" />;
const ItalicIcon = (p: IP) => <Stroke {...p} d="M9.16683 4.16797H14.1668M5.8335 15.8346H10.8335M11.6668 4.16797L8.3335 15.8346" />;
const UnderlineIcon = (p: IP) => <Stroke {...p} d="M5.83317 4.16797V8.33464C5.83317 9.4397 6.27216 10.4995 7.05356 11.2809C7.83496 12.0623 8.89477 12.5013 9.99984 12.5013C11.1049 12.5013 12.1647 12.0623 12.9461 11.2809C13.7275 10.4995 14.1665 9.4397 14.1665 8.33464V4.16797M4.1665 15.8346H15.8332" />;
const StrikeIcon = (p: IP) => <Stroke {...p} d="M4.1665 9.99902H15.8332M13.3332 5.4149C13.1442 5.0482 12.7111 4.7246 12.1053 4.4974C11.4994 4.27019 10.7568 4.15292 9.99984 4.1649H9.1665C8.39296 4.1649 7.65109 4.47219 7.10411 5.01917C6.55713 5.56615 6.24984 6.30802 6.24984 7.08156C6.24984 7.85511 6.55713 8.59698 7.10411 9.14396C7.65109 9.69094 8.39296 9.99823 9.1665 9.99823H10.8332C11.6067 9.99823 12.3486 10.3055 12.8956 10.8525C13.4425 11.3995 13.7498 12.1413 13.7498 12.9149C13.7498 13.6884 13.4425 14.4303 12.8956 14.9773C12.3486 15.5243 11.6067 15.8316 10.8332 15.8316H9.58317C8.8262 15.8435 8.08363 15.7263 7.47775 15.4991C6.87187 15.2719 6.4388 14.9483 6.24984 14.5816" />;
const BallpenIcon = (p: IP) => <Stroke {...p} d="M11.6668 5L17.5002 10.8333L14.1668 14.1667M3.3335 16.6654L4.80683 15.1921M4.85652 15.1434C5.07537 15.3623 5.33519 15.536 5.62116 15.6544C5.90713 15.7729 6.21364 15.8339 6.52319 15.8339C6.83273 15.8339 7.13924 15.7729 7.42521 15.6544C7.71118 15.536 7.97101 15.3623 8.18985 15.1434L17.0115 6.32173C17.1664 6.16695 17.2892 5.98319 17.373 5.78094C17.4568 5.57869 17.4999 5.3619 17.4999 5.14298C17.4999 4.92405 17.4568 4.70727 17.373 4.50502C17.2892 4.30276 17.1664 4.119 17.0115 3.96423L16.0357 2.98839C15.8809 2.83356 15.6972 2.71073 15.4949 2.62693C15.2926 2.54313 15.0759 2.5 14.8569 2.5C14.638 2.5 14.4212 2.54313 14.219 2.62693C14.0167 2.71073 13.833 2.83356 13.6782 2.98839L4.85652 11.8101C4.63761 12.0289 4.46395 12.2887 4.34547 12.5747C4.227 12.8607 4.16602 13.1672 4.16602 13.4767C4.16602 13.7863 4.227 14.0928 4.34547 14.3787C4.46395 14.6647 4.63761 14.9245 4.85652 15.1434Z" />;
const SuperscriptIcon = (p: IP) => <Stroke {...p} d="M4.1665 5.83333L7.49984 10M7.49984 10L10.8332 14.1667M7.49984 10L4.1665 14.1667M7.49984 10L10.8332 5.83333M17.4998 9.16662H14.1665L17.0832 5.83329C17.1926 5.64178 17.2632 5.43059 17.2911 5.21177C17.3189 4.99296 17.3033 4.77081 17.2453 4.55801C17.1873 4.34521 17.0879 4.14593 16.9528 3.97153C16.8178 3.79714 16.6497 3.65106 16.4582 3.54162C16.0714 3.32061 15.6127 3.26229 15.1829 3.3795C14.7531 3.49671 14.3875 3.77985 14.1665 4.16662" />;
const SubscriptIcon = (p: IP) => <Stroke {...p} d="M4.1665 5.83203L7.49984 9.9987M7.49984 9.9987L10.8332 14.1654M7.49984 9.9987L4.1665 14.1654M7.49984 9.9987L10.8332 5.83203M17.4998 16.6653H14.1665L17.0832 13.332C17.1926 13.1405 17.2632 12.9293 17.2911 12.7105C17.3189 12.4917 17.3033 12.2695 17.2453 12.0567C17.1873 11.8439 17.0879 11.6446 16.9528 11.4702C16.8178 11.2958 16.6497 11.1497 16.4582 11.0403C16.2667 10.9309 16.0555 10.8602 15.8367 10.8324C15.6178 10.8046 15.3957 10.8202 15.1829 10.8782C14.9701 10.9362 14.7708 11.0356 14.5964 11.1707C14.422 11.3057 14.2759 11.4738 14.1665 11.6653" />;
const ListIcon = (p: IP) => <Stroke {...p} d="M7.49984 5H16.6665M7.49984 10H16.6665M7.49984 15H16.6665M4.1665 5V5.00833M4.1665 10V10.0083M4.1665 15V15.0083" />;
const ListNumbersIcon = (p: IP) => <Stroke {...p} d="M9.16683 4.9987H16.6668M9.16683 9.9987H16.6668M10.0002 14.9987H16.6668M3.3335 13.332C3.3335 12.89 3.50909 12.4661 3.82165 12.1535C4.13421 11.841 4.55814 11.6654 5.00016 11.6654C5.44219 11.6654 5.86611 11.841 6.17867 12.1535C6.49123 12.4661 6.66683 12.89 6.66683 13.332C6.66683 13.8245 6.25016 14.1654 5.8335 14.582L3.3335 16.6654H6.66683M5.00016 8.33203V3.33203L3.3335 4.9987" />;
const LinkIcon = (p: IP) => <Stroke {...p} d="M7.49988 12.4987L12.4999 7.4987M9.16654 4.99895L9.55238 4.55229C10.3339 3.77089 11.3938 3.33195 12.4989 3.33203C13.6041 3.33211 14.6639 3.7712 15.4453 4.5527C16.2267 5.33421 16.6656 6.39411 16.6655 7.49925C16.6655 8.60438 16.2264 9.66423 15.4449 10.4456L14.9999 10.8323M10.8331 14.9987L10.5023 15.4437C9.71167 16.2255 8.64462 16.664 7.53271 16.664C6.4208 16.664 5.35375 16.2255 4.56313 15.4437C4.17342 15.0584 3.86404 14.5995 3.65289 14.0938C3.44173 13.5881 3.33301 13.0455 3.33301 12.4974C3.33301 11.9494 3.44173 11.4068 3.65289 10.9011C3.86404 10.3953 4.17342 9.93653 4.56313 9.5512L4.99979 9.16536" />;
const PhotoPlusIcon = (p: IP) => <Stroke {...p} d="M12.5 6.66667H12.5083M10.4167 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V10.4167M2.5 13.3332L6.66667 9.16652C7.44 8.42236 8.39333 8.42236 9.16667 9.16652L12.5 12.4999M11.6667 11.667L12.5 10.8337C13.0583 10.297 13.7083 10.147 14.3183 10.3837M13.3333 15.8333H18.3333M15.8333 13.3333V18.3333" />;
const BrandXIcon = (p: IP) => <Stroke {...p} d="M3.3335 16.6654L8.9735 11.0254M11.0235 8.97536L16.6668 3.33203M3.3335 3.33203L13.111 16.6654H16.6668L6.88933 3.33203H3.3335Z" />;

// YouTube keeps its Figma brand red fill.
const YoutubeIcon = ({ className = "w-5 h-5" }: IP) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.0002 2.5C15.5473 2.5 16.0892 2.60777 16.5947 2.81717C17.1002 3.02656 17.5595 3.33348 17.9464 3.72039C18.3334 4.1073 18.6403 4.56663 18.8497 5.07215C19.0591 5.57768 19.1668 6.11949 19.1668 6.66667V13.3333C19.1668 13.8805 19.0591 14.4223 18.8497 14.9278C18.6403 15.4334 18.3334 15.8927 17.9464 16.2796C17.5595 16.6665 17.1002 16.9734 16.5947 17.1828C16.0892 17.3922 15.5473 17.5 15.0002 17.5H5.00016C4.45299 17.5 3.91117 17.3922 3.40565 17.1828C2.90013 16.9734 2.4408 16.6665 2.05388 16.2796C1.27248 15.4982 0.833496 14.4384 0.833496 13.3333V6.66667C0.833496 5.5616 1.27248 4.50179 2.05388 3.72039C2.83529 2.93899 3.89509 2.5 5.00016 2.5H15.0002ZM7.50016 7.5V12.5C7.50028 12.6474 7.53948 12.7921 7.61376 12.9194C7.68803 13.0466 7.79474 13.152 7.92299 13.2246C8.05124 13.2971 8.19645 13.3344 8.34381 13.3326C8.49117 13.3308 8.63542 13.2899 8.76183 13.2142L12.9285 10.7142C13.0517 10.6401 13.1537 10.5354 13.2244 10.4102C13.2952 10.2851 13.3324 10.1438 13.3324 10C13.3324 9.85623 13.2952 9.71491 13.2244 9.58977C13.1537 9.46462 13.0517 9.35992 12.9285 9.28583L8.76183 6.78583C8.63542 6.71008 8.49117 6.66921 8.34381 6.66739C8.19645 6.66556 8.05124 6.70285 7.92299 6.77545C7.79474 6.84804 7.68803 6.95335 7.61376 7.08064C7.53948 7.20792 7.50028 7.35263 7.50016 7.5Z" fill="#DB3D3B" />
  </svg>
);
