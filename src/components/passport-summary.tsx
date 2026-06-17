import { explorerLevel, type Trip } from "@/lib/trips";
import { TrustBadge } from "@/components/trust-badge";

export function PassportSummary({ name, trips, trustScore }: {
  name: string; trips: Trip[]; trustScore: number;
}) {
  const level = explorerLevel(trips.length);
  const stamps = Array.from(new Set(trips.map((t) => t.destination)));
  const shown = stamps.slice(0, 6);
  const extra = stamps.length - shown.length;

  return (
    <div className="rounded-2xl p-6 md:p-8 text-white" style={{ background: "#0D2622" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono-accent text-[11px] uppercase tracking-[0.18em] text-white/60">Travel passport</div>
          <div className="mt-3 font-display text-3xl md:text-4xl">{name}</div>
          <div className="mt-1 text-sm text-white/70">{level}</div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <TrustBadge score={trustScore} dark />
          <div className="text-right">
            <div className="font-display font-semibold text-4xl md:text-5xl leading-none">{trips.length}</div>
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.15em] text-white/60 mt-1">trips logged</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="font-mono-accent text-[10px] uppercase tracking-[0.18em] text-white/50 mb-3">Stamps</div>
        {stamps.length === 0 ? (
          <div className="text-sm text-white/50 italic">No stamps yet</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {shown.map((s) => (
              <span key={s} className="font-mono-accent text-xs px-3 py-1 rounded-full border border-white/25 text-white/90">
                {s}
              </span>
            ))}
            {extra > 0 && (
              <span className="font-mono-accent text-xs px-3 py-1 rounded-full border border-white/25 text-white/70">
                +{extra}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
