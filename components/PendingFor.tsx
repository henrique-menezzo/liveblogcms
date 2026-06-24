"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "./icons";
import { formatElapsed } from "@/lib/post-helpers";

// Live "Pending for X" indicator shown in the editor for posts awaiting review.
export function PendingFor({ since }: { since: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-[#fef3e2] text-[#9a5a00] px-2.5 py-1.5 text-xs font-medium">
      <ClockIcon className="w-3.5 h-3.5" />
      Pending for {formatElapsed(since)}
    </div>
  );
}
