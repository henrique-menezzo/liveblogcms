"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckIcon, CloseIcon } from "./icons";

// Lightweight toast system matching the Figma flows ("Post Rejected",
// "Pinned successfully!"): a green pill in the top-right that auto-dismisses.
type Toast = { id: number; message: string };

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed top-3 right-3 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} message={t.message} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ message, onClose }: { message: string; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const iv = setInterval(() => setProgress(Math.min(1, (Date.now() - start) / 3200)), 60);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative overflow-hidden min-w-[280px] flex items-center gap-2 rounded-lg bg-[#d5fbe0] border border-[#86efac] pl-4 pr-3 py-3 shadow-lg">
      <span className="grid place-items-center w-5 h-5 rounded-full text-success">
        <CheckIcon className="w-4 h-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-[#065f46]">{message}</span>
      <button onClick={onClose} className="text-[#065f46]/70 hover:text-[#065f46]" aria-label="Dismiss">
        <CloseIcon className="w-4 h-4" />
      </button>
      {/* progress bar like Figma */}
      <span
        className="absolute left-0 bottom-0 h-0.5 bg-success transition-[width] ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
