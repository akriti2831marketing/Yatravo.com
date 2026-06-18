import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Local Marketplace — Yatravo" },
      { name: "description", content: "Homestays, local guides, family dhabas, and hidden stays at honest prices — flat-fee, not commission." },
      { property: "og:title", content: "Local Marketplace — Yatravo" },
      { property: "og:description", content: "The stays, guides, and food trails that never needed to advertise. Until now." },
      { property: "og:url", content: "/marketplace" },
    ],
    links: [{ rel: "canonical", href: "/marketplace" }],
  }),
  component: MarketplacePage,
});

const cats = ["Homestays", "Local Guides", "Food Trails", "Adventure Operators", "Heritage Stays", "Wellness Retreats"];

const vendors = [
  { name: "Devi's Homestay", loc: "Manali, HP", cat: "Homestay", since: "Mar 2025", reviews: 47, rating: 4.9 },
  { name: "Coorg Trails", loc: "Madikeri, KA", cat: "Local Guide", since: "Feb 2025", reviews: 32, rating: 4.8 },
  { name: "Old Town Dhaba", loc: "Amritsar, PB", cat: "Food Trail", since: "Apr 2025", reviews: 89, rating: 4.9 },
];

function MarketplacePage() {
  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-16 lg:pt-24 pb-16 bg-ember-light">
        <div className="max-w-5xl mx-auto">
          <div className="eyebrow" style={{ color: "var(--ember)" }}>marketplace</div>
          <h1 className="mt-5 font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            The places that never needed to advertise. Until now.
          </h1>
          <p className="mt-6 text-lg text-mute max-w-2xl leading-relaxed">
            Homestays, local guides, family dhabas, and hidden stays — listed at honest prices because we charge vendors a flat fee, not a percentage.
          </p>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow" style={{ color: "var(--ember)" }}>browse by category</div>
          <h2 className="mt-4 font-display text-4xl max-w-2xl leading-tight">What kind of trip are you planning?</h2>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
            {cats.map((c) => (
              <div
                key={c}
                className="stamp-card stamp-card-ember p-6 min-w-[220px]"
              >
                <div className="w-9 h-9 rounded-md bg-ember-light text-[var(--ember)] flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                  </svg>
                </div>
                <div className="font-display text-lg">{c}</div>
                <div className="mt-2 text-xs font-mono-accent text-mute">Browse →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl max-w-3xl leading-tight">Why vendors love us.</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="stamp-card stamp-card-ember p-8">
              <div className="font-mono-accent text-xs uppercase text-mute">The old way</div>
              <div className="mt-2 font-display text-2xl">Booking.com</div>
              <ul className="mt-6 space-y-3 text-sm text-ink/80">
                <li className="flex gap-3"><span className="text-[var(--ember)]">—</span>28% commission per booking</li>
                <li className="flex gap-3"><span className="text-[var(--ember)]">—</span>Tourist-facing generic profile</li>
                <li className="flex gap-3"><span className="text-[var(--ember)]">—</span>Algorithm buries new listings</li>
                <li className="flex gap-3"><span className="text-[var(--ember)]">—</span>Reviews from anyone, real or not</li>
              </ul>
            </div>
            <div className="stamp-card p-8" style={{ background: "var(--teal)", color: "white", borderColor: "transparent" }}>
              <div className="font-mono-accent text-xs uppercase text-white/60">Our way</div>
              <div className="mt-2 font-display text-2xl text-white">Yatravo</div>
              <ul className="mt-6 space-y-3 text-sm text-white/85">
                <li className="flex gap-3"><span className="text-white/50">+</span>₹999/month flat — forever</li>
                <li className="flex gap-3"><span className="text-white/50">+</span>Identity-verified reviews only</li>
                <li className="flex gap-3"><span className="text-white/50">+</span>Tribe-matched visibility</li>
                <li className="flex gap-3"><span className="text-white/50">+</span>Direct traveler connection — no middleman</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow" style={{ color: "var(--ember)" }}>vendor spotlight</div>
          <h2 className="mt-4 font-display text-4xl max-w-2xl leading-tight">Honest places, honest prices.</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {vendors.map((v) => (
              <div key={v.name} className="stamp-card stamp-card-ember overflow-hidden">
                <div
                  className="aspect-[4/3]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--ember-light) 0%, var(--sand) 100%)",
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg">{v.name}</div>
                    <div className="font-mono-accent text-sm text-[var(--ember)]">{v.rating}★</div>
                  </div>
                  <div className="text-sm text-mute mt-1">{v.loc} · {v.cat}</div>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono-accent text-mute">
                    <span>Listed since {v.since}</span>
                    <span>{v.reviews} verified reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/waitlist" className="pill-cta pill-primary">Browse the full marketplace</Link>
            <Link to="/vendors" className="pill-cta pill-ghost">List your business</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
