import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { PassportCard } from "@/components/passport-card";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Travel Passport — Stamped" },
      { name: "description", content: "Your travel life, in one place. Log every trip, earn verified badges, own your travel identity forever." },
      { property: "og:title", content: "Travel Passport — Stamped" },
      { property: "og:description", content: "Log every trip. Earn verified badges. Own your travel identity — forever." },
      { property: "og:url", content: "/passport" },
    ],
    links: [{ rel: "canonical", href: "/passport" }],
  }),
  component: PassportPage,
});

const badges = [
  { t: "First Solo Trip", d: "Complete one trip alone" },
  { t: "Budget Traveler", d: "Avg. under ₹2,000/day across 5 trips" },
  { t: "Mountain Explorer", d: "5+ verified hill trips" },
  { t: "Coastal Wanderer", d: "Beach destinations across 3 states" },
  { t: "Cultural Immersion", d: "Stay 7+ days in one local community" },
  { t: "Foodie Trail", d: "Document local cuisine in 10 cities" },
  { t: "International", d: "Trips logged across 3+ countries" },
  { t: "Verified Reviewer", d: "Write 10 reviews from logged trips" },
];

function PassportPage() {
  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow">the passport</div>
            <h1 className="mt-5 font-display font-semibold text-5xl lg:text-6xl leading-[1.05]">
              Your travel life, in one place.
            </h1>
            <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
              Log every trip. Earn verified badges. Own your travel identity — forever.
            </p>
            <Link to="/waitlist" className="mt-8 inline-flex pill-cta pill-primary">
              Start your passport — it's free
            </Link>
          </div>
          <PassportCard floating />
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">badges</div>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl max-w-2xl leading-tight">
            How badges work.
          </h2>
          <p className="mt-4 text-mute max-w-xl">
            Every badge is earned from verified trips — not self-reported. Your passport reflects what you've actually done.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {badges.map((b) => (
              <div key={b.t} className="stamp-card p-6">
                <div className="w-10 h-10 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-teal mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="9" r="6" />
                    <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
                  </svg>
                </div>
                <div className="font-display text-lg">{b.t}</div>
                <div className="mt-2 text-sm text-mute leading-relaxed">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl leading-tight">
            Your data. Your passport.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { t: "You control what's public", d: "Hide individual trips, badges, or your whole profile in a single click." },
              { t: "You can export everything", d: "Download your full trip history as JSON or PDF, any time." },
              { t: "We never sell your data", d: "No ads, no third-party brokers. Your travel history is not a product." },
            ].map((p) => (
              <div key={p.t} className="stamp-card p-6">
                <div className="font-display text-lg">{p.t}</div>
                <div className="mt-3 text-mute text-sm leading-relaxed">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
