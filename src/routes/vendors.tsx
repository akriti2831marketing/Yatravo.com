import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "For Local Businesses — Yatravo" },
      { name: "description", content: "List your homestay, guide service, or local experience on Yatravo. Free to join. Free to list. No commission, ever." },
      { property: "og:title", content: "For Local Businesses — Yatravo" },
      { property: "og:description", content: "Your guests are already on Yatravo. Come find them. Free to list. Always." },
      { property: "og:url", content: "/vendors" },
    ],
    links: [{ rel: "canonical", href: "/vendors" }],
  }),
  component: VendorsPage,
});

function VendorsPage() {
  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-16 lg:pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="eyebrow">for local businesses</div>
          <h1 className="mt-5 font-display font-semibold text-4xl sm:text-5xl lg:text-[64px] leading-[1.05]">
            Your guests are already on Yatravo. Come find them.
          </h1>
          <p className="mt-6 text-lg text-mute max-w-2xl leading-relaxed">
            We built Yatravo's local marketplace for businesses like yours — the ones that are too good to need a big platform, but too hidden to be found without one. Listing is free. Always.
          </p>
        </div>
      </section>

      {/* Why local businesses choose Yatravo */}
      <section className="section-pad px-6 lg:px-10 bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="eyebrow text-teal">why yatravo</div>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl text-white max-w-3xl leading-tight">
            Why local businesses choose Yatravo.
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            We're not here to take a cut. We're here to connect the right travelers to the right places.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              {
                t: "Free to list, free to stay listed",
                d: "Create your profile, add your photos, tell your story. No subscription, no setup fee, no commission. We're building this community together.",
              },
              {
                t: "Travelers who actually care where they stay",
                d: "Every traveler on Yatravo has a verified passport with real trip history. These aren't random tourists — they're people who chose your kind of place on purpose.",
              },
              {
                t: "Reviews that mean something",
                d: "Only verified passport holders who have genuinely logged travel can leave reviews on your listing. No fake reviews. No review bombing. Just honest feedback from real travelers.",
              },
            ].map((c) => (
              <div key={c.t} className="border-l-4 border-teal bg-white/[0.03] p-6 rounded-lg">
                <div className="font-display text-xl text-white">{c.t}</div>
                <div className="mt-3 text-white/70 text-sm leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl max-w-2xl leading-tight">
            Everything you need to be found by the right people.
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "A beautiful listing page that tells your real story — not just room counts and star ratings",
              "Visibility to travelers who are specifically planning a trip to your region",
              "Direct inquiries from travelers — no middleman, no booking fee taken",
              "A 'Verified Local' badge that shows across the Yatravo platform",
              "Reviews only from travelers with verified trip history on Yatravo",
              "A simple dashboard to manage your profile and track inquiries",
            ].map((b) => (
              <div key={b} className="stamp-card p-6">
                <div className="text-teal font-mono-accent text-xs mb-2">✓</div>
                <div className="text-ink/85 leading-relaxed text-[15px]">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-2xl lg:text-3xl font-display leading-relaxed">
            "We'd been running our place for years but always felt invisible online. Yatravo felt different — like it was built by someone who'd actually stayed at a place like ours."
          </div>
          <div className="mt-6 font-mono-accent text-sm text-mute">Priya M. · Coorg</div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-3xl mx-auto stamp-card p-10 text-center">
          <h2 className="font-display text-3xl lg:text-4xl leading-tight">
            Ready to be found by travelers who'll love what you've built?
          </h2>
          <p className="mt-5 text-mute leading-relaxed max-w-xl mx-auto">
            List your homestay, guide service, or local experience on Yatravo. Free to join. Free to list. No commission, ever.
          </p>
          <Link to="/waitlist" className="mt-8 inline-flex pill-cta pill-primary">
            List my business — it's free
          </Link>
          <div className="mt-4 text-xs font-mono-accent text-mute">
            Takes less than 10 minutes. No credit card needed.
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
