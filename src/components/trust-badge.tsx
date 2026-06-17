import { useState } from "react";
import { trustBadgeStyle } from "@/lib/trips";

export function TrustBadge({ score, dark = false }: { score: number; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const s = trustBadgeStyle(score);
  return (
    <div className="relative inline-flex items-center gap-2">
      <span
        className="font-mono-accent text-xs px-2.5 py-1 rounded-full"
        style={{ background: s.bg, color: s.fg }}
      >
        Trust: {score} · {s.label}
      </span>
      <button
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label="What is trust score?"
        className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center border ${
          dark ? "border-white/40 text-white/70" : "border-sand text-mute"
        }`}
      >
        ?
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white text-ink border border-sand rounded-lg p-3 text-xs leading-relaxed shadow-md z-10">
          Your trust score reflects how much of your travel history is backed by evidence — photos, verified bookings, or confirmation from other travelers. It's not a guarantee, just a transparent signal for other travelers and vendors.
        </div>
      )}
    </div>
  );
}
