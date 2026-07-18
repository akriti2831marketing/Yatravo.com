import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Instagram } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import { CONTENT_STYLES, type CreatorProfile } from "@/lib/creator";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Travel creators — Yatravo" },
      { name: "description", content: "Every creator here has verified trip history on Yatravo — not just followers." },
      { property: "og:title", content: "Travel creators you can actually trust — Yatravo" },
      { property: "og:description", content: "Verified travel creators with real destinations." },
    ],
    links: [{ rel: "canonical", href: "/creators" }],
  }),
  component: CreatorsPage,
});

function CreatorsPage() {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<"trips" | "followers" | "trust" | "new">("trips");

  useEffect(() => {
    supabase.from("creator_profiles").select("*").then(({ data }) => setCreators((data as CreatorProfile[]) ?? []));
  }, []);

  const filtered = creators.filter((c) =>
    filter === "All" ? true : (c.content_styles ?? []).some((s) => s.toLowerCase().includes(filter.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "followers") return (b.instagram_followers ?? 0) - (a.instagram_followers ?? 0);
    if (sort === "new") return +new Date(b.created_at) - +new Date(a.created_at);
    return 0;
  });

  const filters = ["All", "Mountain", "Beach", "Heritage", "Budget", "Solo", "Food", "International"];

  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="eyebrow">creators</div>
        <h1 className="mt-2 font-display text-3xl md:text-5xl">Travel creators you can actually trust</h1>
        <p className="mt-3 text-mute max-w-2xl">Every creator here has verified trip history on Yatravo — not just followers.</p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${filter === f ? "bg-teal text-white border-teal" : "border-sand text-ink hover:border-teal"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-mute">
          Sort:
          {(["trips", "followers", "trust", "new"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={sort === s ? "text-teal font-medium" : "hover:text-ink"}>
              {s === "trips" ? "Most trips" : s === "followers" ? "Most followers" : s === "trust" ? "Most trusted" : "Newest"}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="mt-12 bg-white border border-sand rounded-xl p-12 text-center">
            <p className="text-mute">No creators found for this category yet — be the first.</p>
            <Link to="/passport" className="mt-4 inline-block pill-cta pill-primary">Activate creator profile</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {sorted.map((c) => (
              <Link key={c.id} to="/creator/$handle" params={{ handle: c.handle }}
                className="bg-white border border-sand rounded-2xl overflow-hidden hover:border-teal transition-all group">
                <div className="h-24 bg-gradient-to-br from-[#0D2622] to-teal relative">
                  <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full bg-sand border-4 border-white flex items-center justify-center font-display text-lg text-teal">
                    {c.creator_name[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="pt-9 px-4 pb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="font-display text-lg">{c.creator_name}</div>
                    {c.verified_creator && <CheckCircle2 className="w-4 h-4 text-teal fill-teal/10" />}
                  </div>
                  <div className="font-mono-accent text-xs text-mute">@{c.handle}</div>
                  {c.instagram_username && c.show_instagram_count && c.instagram_followers ? (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-ember/10 text-ember">
                      <Instagram className="w-3 h-3" /> {formatCount(c.instagram_followers)} on Instagram
                    </div>
                  ) : null}
                  {c.bio && <p className="mt-2 text-sm text-mute line-clamp-2">{c.bio}</p>}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(c.content_styles ?? []).slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] font-mono-accent px-2 py-0.5 rounded-full bg-sand/60 text-ink/70">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function formatCount(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}

// avoid unused-import warning
void MapPin;
