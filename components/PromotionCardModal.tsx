"use client";

import { useState } from "react";
import { ArrowLeftIcon, CloseIcon, ImagePlusIcon, PencilIcon, PlusIcon, SendIcon, TrashIcon } from "./icons";
import type { PromotionCard } from "@/lib/post-helpers";

type SaveData = { name: string; title: string; description: string; imageURL: string };

// Promotion Cards modal. Opens on a LIBRARY list of saved cards; from there you can
// create a new one, or hover a saved card to post / edit / delete it (Figma).
export function PromotionCardModal({
  cards,
  onClose,
  onPost,
  onSaveNew,
  onSaveEdit,
  onDelete,
}: {
  cards: PromotionCard[];
  onClose: () => void;
  onPost: (id: string) => void;
  onSaveNew: (data: SaveData) => void;
  onSaveEdit: (id: string, data: SaveData) => void;
  onDelete: (id: string) => void;
}) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<PromotionCard | null>(null);

  const openCreate = () => {
    setEditing(null);
    setView("form");
  };
  const openEdit = (card: PromotionCard) => {
    setEditing(card);
    setView("form");
  };
  const handleSave = (data: SaveData) => {
    if (editing) onSaveEdit(editing.id, data);
    else onSaveNew(data);
    setView("list");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6">
      <div className="w-full max-w-[1100px] max-h-[88vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {view === "list" ? (
          <ListView
            cards={cards}
            onClose={onClose}
            onCreate={openCreate}
            onPost={(id) => onPost(id)}
            onEdit={openEdit}
            onDelete={onDelete}
          />
        ) : (
          <FormView
            initial={editing}
            onBack={() => setView("list")}
            onClose={onClose}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

function ListView({
  cards,
  onClose,
  onCreate,
  onPost,
  onEdit,
  onDelete,
}: {
  cards: PromotionCard[];
  onClose: () => void;
  onCreate: () => void;
  onPost: (id: string) => void;
  onEdit: (card: PromotionCard) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className="relative px-6 py-5 border-b border-line shrink-0">
        <h2 className="text-lg font-semibold">Promotion Cards</h2>
        <p className="text-sm text-subtle mt-0.5">Choose a saved card to drop into the live blog feed.</p>
        <button onClick={onClose} className="absolute right-5 top-5 text-subtle hover:text-ink" aria-label="Close">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin p-6">
        <div className="grid grid-cols-3 gap-5">
          {/* Create new */}
          <button
            onClick={onCreate}
            className="min-h-[300px] rounded-xl border border-dashed border-[#c4c4c4] flex flex-col items-center justify-center gap-2 text-subtle hover:text-black hover:border-black/30 transition"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Create new promotion card</span>
          </button>

          {cards.map((card) => (
            <SavedCardTile
              key={card.id}
              card={card}
              onPost={() => onPost(card.id)}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SavedCardTile({
  card,
  onPost,
  onEdit,
  onDelete,
}: {
  card: PromotionCard;
  onPost: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group/tile rounded-xl border border-line p-4 hover:shadow-md transition">
      <div className="relative rounded-lg overflow-hidden">
        {card.imageURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageURL} alt="" className="w-full h-36 object-cover" />
        ) : (
          <div className="w-full h-36 bg-[#0e1a26] grid place-items-center text-center px-4">
            <span className="text-white/90 font-serif">Promotion artwork</span>
          </div>
        )}
        {/* hover actions overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/tile:opacity-100 transition">
          <OverlayBtn tooltip="Post to feed" onClick={onPost}><SendIcon className="w-4 h-4" /></OverlayBtn>
          <OverlayBtn tooltip="Edit" onClick={onEdit}><PencilIcon className="w-4 h-4" /></OverlayBtn>
          <OverlayBtn tooltip="Delete" danger onClick={onDelete}><TrashIcon className="w-4 h-4" /></OverlayBtn>
        </div>
      </div>
      <h4 className="text-base font-semibold text-ink mt-3">{card.title || card.name}</h4>
      {card.description && <p className="text-sm text-subtle mt-1.5 line-clamp-2">{card.description}</p>}
    </div>
  );
}

function OverlayBtn({ children, onClick, tooltip, danger }: { children: React.ReactNode; onClick: () => void; tooltip: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`grid place-items-center w-8 h-8 rounded-lg bg-white shadow hover:bg-zinc-50 transition ${danger ? "text-danger" : "text-black"}`}
    >
      {children}
    </button>
  );
}

function FormView({
  initial,
  onBack,
  onClose,
  onSave,
}: {
  initial: PromotionCard | null;
  onBack: () => void;
  onClose: () => void;
  onSave: (data: SaveData) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageURL, setImageURL] = useState(initial?.imageURL ?? "");
  const isEdit = !!initial;

  const addImage = () => {
    const url = window.prompt("Promotion image URL");
    if (url) setImageURL(url);
  };

  return (
    <>
      <div className="relative flex items-center justify-center px-5 py-4 border-b border-line shrink-0">
        <button onClick={onBack} className="absolute left-5 text-subtle hover:text-ink" aria-label="Back">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold">{isEdit ? "Edit Promotion Card" : "Create Promotion Card"}</h2>
        <button onClick={onClose} className="absolute right-5 text-subtle hover:text-ink" aria-label="Close">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-line overflow-hidden">
        <div className="overflow-y-auto scroll-thin px-6 py-5 space-y-4">
          <h3 className="text-sm font-semibold">Informations</h3>

          {imageURL ? (
            <div className="relative rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageURL} alt="" className="w-full h-44 object-cover" />
              <button
                onClick={() => setImageURL("")}
                className="absolute top-2 right-2 grid place-items-center w-8 h-8 rounded-lg bg-white text-danger shadow hover:bg-red-50"
                aria-label="Remove image"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={addImage}
              className="w-full h-44 rounded-xl border border-dashed border-[#b8b8b8] bg-canvas/40 flex flex-col items-center justify-center gap-2 text-subtle hover:text-black hover:border-black/30 transition"
            >
              <ImagePlusIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Upload promotion image</span>
              <span className="text-xs text-muted">Click to add an image URL</span>
            </button>
          )}

          <Field label="Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g Card Discount Annual Plan"
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </Field>
          <Field label="Title" optional>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g Receive a discount of 5%"
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </Field>
          <Field label="Description" optional>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g This promotion is valid until April 25, 2025"
              className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-zinc-400"
            />
          </Field>
        </div>

        <div className="overflow-y-auto scroll-thin px-6 py-5">
          <h3 className="text-sm font-semibold mb-4">Live Preview</h3>
          <PromotionCardPreview title={title} description={description} imageURL={imageURL} />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-line shrink-0">
        <button onClick={onBack} className="rounded-lg border border-line bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-zinc-50">
          CANCEL
        </button>
        <button
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), title, description, imageURL })}
          className="rounded-lg bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide disabled:opacity-40 hover:bg-black/90"
        >
          {isEdit ? "Save Promotion Card" : "Add Promotion Card"}
        </button>
      </div>
    </>
  );
}

// The promotion card as it renders in the feed and the modal preview.
export function PromotionCardPreview({
  title,
  description,
  imageURL,
}: {
  title: string;
  description: string;
  imageURL: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
      {imageURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageURL} alt="" className="w-full h-44 object-cover rounded-lg" />
      ) : (
        <div className="w-full h-44 rounded-lg bg-[#0e1a26] grid place-items-center text-center px-6">
          <span className="text-white/90 text-lg font-serif leading-snug">Your promotion artwork</span>
        </div>
      )}
      {(title || description) && (
        <div className="pt-4">
          {title && <h4 className="text-xl font-semibold text-ink">{title}</h4>}
          {description && <p className="text-sm text-subtle mt-2">{description}</p>}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, optional, children }: { label: string; required?: boolean; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-label">
        {label} {required && <span className="text-danger">*</span>}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
