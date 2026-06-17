import { useState } from "react";
import { Mountain, Waves, Tent, MapPin } from "lucide-react";
import { badgeForTrip, destinationKind, type Trip } from "@/lib/trips";

function Icon({ kind }: { kind: ReturnType<typeof destinationKind> }) {
  const cls = "w-4 h-4 text-teal";
  if (kind === "mountain") return <Mountain className={cls} />;
  if (kind === "coastal") return <Waves className={cls} />;
  if (kind === "adventure") return <Tent className={cls} />;
  return <MapPin className={cls} />;
}

const styleLabel: Record<string, string> = {
  solo: "Solo", friends: "With friends", family: "Family", couple: "Couple",
};
const tierLabel: Record<string, string> = {
  budget: "Budget", midrange: "Mid-range", premium: "Premium",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function TripList({ trips }: { trips: Trip[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? trips : trips.slice(0, 4);
  const hidden = trips.length - 4;

  return (
    <div className="bg-white border border-sand rounded-xl divide-y divide-sand">
      {visible.map((t) => {
        const b = badgeForTrip(t, trips);
        return (
          <div key={t.id} className="p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center shrink-0">
              <Icon kind={destinationKind(t.destination)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{t.destination}</div>
              <div className="text-xs text-mute mt-0.5">
                {fmt(t.start_date)} – {fmt(t.end_date)}
              </div>
              <div className="text-xs text-mute mt-0.5">
                {t.travel_style && styleLabel[t.travel_style]}
                {t.travel_style && t.budget_tier && " · "}
                {t.budget_tier && tierLabel[t.budget_tier]}
              </div>
            </div>
            {b && (
              <span className="font-mono-accent text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "#E1F5EE", color: "#085041" }}>
                {b.label}
              </span>
            )}
          </div>
        );
      })}
      {!expanded && hidden > 0 && (
        <button onClick={() => setExpanded(true)}
                className="w-full p-3 text-sm text-teal hover:bg-canvas font-medium">
          +{hidden} more trip{hidden > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
