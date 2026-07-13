import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/tribe")({
  head: () => ({
    meta: [
      { title: "Find Your Tribe — Yatravo" },
      { name: "description", content: "Find real travelers heading to the same place, at the same time, with the same budget — verified by their actual trip history." },
      { property: "og:title", content: "Find Your Tribe — Yatravo" },
      { property: "og:description", content: "Find verified co-travelers heading where you are. Split costs. Share cabs. Travel better. Free to join." },
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
            Someone is heading to Kasol next weekend. They just haven't found you yet.
          </h1>
          <p className="mt-6 text-lg text-mute max-w-2xl leading-relaxed">
            Yatravo matches you with real travelers heading to the same place, at the same time, with the same budget — verified by their actual trip history, not a profile they wrote in 2 minutes.
          </p>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">how matching works</div>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl max-w-3xl leading-tight">
            Finding the right travel partner used to be luck. Not anymore.
          </h2>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Set your trip", d: "Tell us where you're going and when you're heading there." },
              { n: "02", t: "We find real matches", d: "We look at real traveler profiles — trips logged, badges earned, travel style verified — and find the ones who genuinely match yours." },
              { n: "03", t: "Browse their passport", d: "See where they've been, how they travel, and what kind of trips they take." },
              { n: "04", t: "Connect", d: "Plan together, split costs — or just have a familiar face at your destination." },
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
            <h2 className="font-display text-4xl leading-tight">We take who you meet seriously.</h2>
            <p className="mt-4 text-mute max-w-md">
              Every traveler you see on Yatravo has a verified passport. Real trips. Real history. Real accountability.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Real trip history visible before you connect",
              "Community-verified profiles",
              "Report and block, always available",
              "Your safety is never optional",
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
              { t: "Split the cab to Leh", d: "Four people, one cab, a fraction of the cost. Find your co-riders before you go." },
              { t: "Find a trek partner for Roopkund", d: "Some trails are better with someone who's got your back. Find them here." },
              { t: "Co-plan a Goa trip", d: "A villa that sleeps 6 is half the price per person. Find your group and make it happen." },
            ].map((u) => (
              <div key={u.t} className="border-l-4 border-teal bg-white/[0.03] p-6 rounded-lg">
                <div className="font-display text-xl text-white">{u.t}</div>
                <div className="mt-3 text-white/65 text-sm leading-relaxed">{u.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link to="/waitlist" className="pill-cta bg-white text-teal hover:bg-canvas">
              Find who's going where you're going — it's free
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
