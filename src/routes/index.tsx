import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { PassportCard } from "@/components/passport-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yatravo — Your free travel passport" },
      {
        name: "description",
        content:
          "Log every trip, find people going where you're going, and discover stays that actually care who shows up. Free to join. Free to use.",
      },
      { property: "og:title", content: "Yatravo — Your free travel passport" },
      {
        property: "og:description",
        content:
          "Log every trip, find your tribe, and discover local stays. Free to join, free to list, no commissions.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="px-6 lg:px-10 pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow">travel differently. together.</div>
            <h1 className="mt-5 font-display font-semibold text-[40px] sm:text-5xl lg:text-[72px] leading-[1.02] tracking-tight">
              Your journeys deserve to be remembered. And shared.
            </h1>
            <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
              Yatravo is your free travel passport — log every trip, find people
              going where you're going, and discover stays that actually care
              who shows up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/waitlist" className="pill-cta pill-primary">
                Build my passport — it's free
              </Link>
              <a href="#how" className="pill-cta pill-ghost">
                See how it works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#0E7C6B", "#C4622D", "#1D9E75", "#0a5e51", "#6B6860"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-canvas"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="font-mono-accent text-xs text-mute">
                Join thousands of travelers already building their passport
              </div>
            </div>
          </div>
          <div className="relative">
            <PassportCard floating />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 lg:px-10 section-pad">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-display font-medium text-3xl lg:text-4xl leading-tight">
              You've travelled. But nobody knows it.
            </h2>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {[
              "Every trip you've taken is stuck in old emails, WhatsApp forwards, and photos nobody can verify. Your real travel story deserves better.",
              "You wanted someone to split that cab to Leh with. Or find a trek partner for Roopkund. But there was nowhere real to look.",
              "The best local stays — the family homestay in Manali, the 40-year-old dhaba in Coorg — are invisible online because they can't afford the big platforms.",
            ].map((t) => (
              <div
                key={t}
                className="pl-5 border-l-4 border-teal py-2 text-lg text-ink/85 leading-relaxed"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 lg:px-10 section-pad bg-teal-light/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">what yatravo gives you</div>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-5xl max-w-3xl leading-tight">
            Three things we built because no one else did.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<IconPassport />}
              title="Your travel story, finally in one place."
              body="Log every trip you've ever taken. Earn badges for the places you've loved. Build a passport that actually shows who you are as a traveler — not just who you say you are. And it's yours forever, free."
              stat="every trip you log makes your passport richer"
            />
            <FeatureCard
              icon={<IconPeople />}
              title="Find your people before the trip, not after."
              body="Tell us where you're headed and when. We find real travelers — verified by their actual trip history — who match your budget, pace, and travel style. No randoms. No guesswork. Just the right people."
              stat="trips are better when the right people join"
            />
            <FeatureCard
              icon={<IconStore />}
              title="Discover places that don't show up on Google."
              body="A homestay run by a family who's lived there for generations. A local guide who knows the trail nobody else takes. A dhaba that's been feeding travelers for 40 years. Real places. Real people. No middlemen."
              stat="honest prices because nobody takes a cut"
              ember
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — dark */}
      <section id="how" className="section-pad px-6 lg:px-10 bg-ink text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white max-w-3xl leading-tight">
            Get started in under 5 minutes. No credit card. No catch.
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-teal/40" />
            {[
              {
                n: "01",
                t: "Build your passport",
                d: "Log your past trips or start fresh. Your travel history builds up over time — every destination, every badge, every memory.",
              },
              {
                n: "02",
                t: "Find your tribe",
                d: "Tell us your next destination and dates. We'll show you real travelers heading the same way, matched by budget and travel style.",
              },
              {
                n: "03",
                t: "Discover local",
                d: "Browse homestays, guides, and hidden gems handpicked by travelers who've actually been there. No commissions, no inflated prices.",
              },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="w-12 h-12 rounded-full bg-teal text-white font-mono-accent flex items-center justify-center relative z-10">
                  {s.n}
                </div>
                <div className="mt-6 font-display text-2xl text-white">{s.t}</div>
                <p className="mt-3 text-white/65 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">from the road</div>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-5xl max-w-2xl leading-tight">
            Real travelers. Real homestays. Real stories.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Quote
              q="I'd been solo travelling for years but always struggled to find the right co-traveler. Found my Spiti squad through Yatravo in two days. We're planning our next trip already."
              n="Ananya S."
              w="Mumbai"
            />
            <Quote
              q="We've been running our guesthouse in Manali for 12 years. Yatravo was the first platform that actually felt like it was built for places like ours, not just for the big hotels."
              n="Ranjit D."
              w="Manali"
              ember
            />
            <Quote
              q="I log every trip I take now. When I meet other travelers, I share my Yatravo passport. It's the most honest travel profile I've ever had."
              n="Vikram T."
              w="Bangalore"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad px-6 lg:px-10" style={{ background: "var(--teal)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-display font-semibold text-4xl lg:text-5xl text-white leading-tight">
            Ready to travel like you mean it?
          </h2>
          <p className="mt-6 text-lg text-white/85 max-w-2xl mx-auto">
            Join Yatravo free. Log your first trip today. Find who's going where you're going next.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder:text-white/55 focus:outline-none focus:bg-white/15 focus:border-white"
            />
            <button className="pill-cta bg-white text-teal hover:bg-canvas">
              Start my journey — it's free
            </button>
          </form>
          <div className="mt-4 text-sm text-white/70">
            No subscription. No credit card. Just your passport.
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  stat,
  ember,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  stat: string;
  ember?: boolean;
}) {
  return (
    <div className={`stamp-card ${ember ? "stamp-card-ember" : ""} p-7`}>
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
        style={{
          background: ember ? "var(--ember-light)" : "var(--teal-light)",
          color: ember ? "var(--ember)" : "var(--teal)",
        }}
      >
        {icon}
      </div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-3 text-mute leading-relaxed text-[15px]">{body}</p>
      <div
        className="mt-6 inline-block px-3 py-1.5 rounded-md font-mono-accent text-xs"
        style={{
          background: ember ? "var(--ember-light)" : "var(--teal-light)",
          color: ember ? "var(--ember)" : "var(--teal)",
        }}
      >
        {stat}
      </div>
    </div>
  );
}

function Quote({ q, n, w, ember }: { q: string; n: string; w: string; ember?: boolean }) {
  return (
    <div className={`stamp-card ${ember ? "stamp-card-ember" : ""} p-7`}>
      <div className="text-[15px] leading-relaxed text-ink/85">"{q}"</div>
      <div className="mt-6 pt-5 border-t border-sand">
        <div className="font-display text-base">{n}</div>
        <div className="text-xs font-mono-accent text-mute mt-1">{w}</div>
      </div>
    </div>
  );
}

function IconPassport() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <path d="M8 18h8" />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <path d="M15 20c0-2 2-3.5 4-3.5s4 1.5 4 3.5" />
    </svg>
  );
}
function IconStore() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}
