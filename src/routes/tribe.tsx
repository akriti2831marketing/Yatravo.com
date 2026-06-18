import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/tribe")({
  head: () => ({
    meta: [
      { title: "Find Your Tribe — Yatravo" },
      { name: "description", content: "Tribe matching connects travelers by destination, dates, budget, and travel style — verified by real trip history." },
      { property: "og:title", content: "Find Your Tribe — Yatravo" },
      { property: "og:description", content: "Find verified co-travelers heading where you are. Split costs. Share cabs. Travel better." },
      { property: "og:url", content: "/tribe" },
    ],
    links: [{ rel: "canonical", href: "/tribe" }],
  }),
  component: TribePage,
});

function TribePage() {
  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-16 lg:pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="eyebrow">tribe matching</div>
          <h1 className="mt-5 font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Someone is going to Kasol next weekend. They just don't know you yet.
          </h1>
          <p className="mt-6 text-lg text-mute max-w-2xl leading-relaxed">
            Tribe matching connects travelers by destination, dates, budget, and travel style — verified by real trip history, not a dating-app bio.
          </p>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">how matching works</div>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl max-w-3xl leading-tight">
            Four steps from "I'm going alone" to "we're splitting the cab."
          </h2>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Set your trip", d: "Destination, dates, and budget range." },
              { n: "02", t: "We scan passports", d: "Only travelers with verified history in that region." },
              { n: "03", t: "Browse profiles", d: "See trips logged, pace, budget tier, and travel style." },
              { n: "04", t: "Connect", d: "Split costs, share a cab, or just have backup." },
            ].map((s) => (
              <div key={s.n} className="stamp-card p-6">
                <div className="font-mono-accent text-xs text-teal">{s.n}</div>
                <div className="mt-3 font-display text-lg">{s.t}</div>
                <div className="mt-2 text-sm text-mute leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-4xl leading-tight">Only verified passport holders can match.</h2>
            <p className="mt-4 text-mute max-w-md">
              Trust is the whole point. Every traveler you see has logged trips we can verify.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Identity verification",
              "Trip history visible",
              "Community reporting",
              "Optional video intro",
            ].map((t) => (
              <div key={t} className="stamp-card p-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-light text-teal flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div className="font-medium">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-ink text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl text-white max-w-2xl leading-tight">
            What people actually use tribe for.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { t: "Split the cab to Leh", d: "Four travelers, one shared SUV, ₹4,200 saved each way." },
              { t: "Find a trek partner for Roopkund", d: "Match by pace and experience, not who replied first on Reddit." },
              { t: "Co-rent a villa in Goa for 4", d: "Two couples, one villa, half the price each." },
            ].map((u) => (
              <div key={u.t} className="border-l-4 border-teal bg-white/[0.03] p-6 rounded-lg">
                <div className="font-display text-xl text-white">{u.t}</div>
                <div className="mt-3 text-white/65 text-sm leading-relaxed">{u.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link to="/waitlist" className="pill-cta bg-white text-teal hover:bg-canvas">
              Find who's going where you're going
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
