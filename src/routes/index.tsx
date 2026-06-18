import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";
import { PassportCard } from "@/components/passport-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yatravo — Your lifelong travel identity" },
      {
        name: "description",
        content:
          "Not a booking app. A living record of every trip you've taken, every place you've loved, and every traveler going where you're going next.",
      },
      { property: "og:title", content: "Yatravo — Your lifelong travel identity" },
      {
        property: "og:description",
        content:
          "Log every trip, find co-travelers, and discover local stays without big-platform commissions.",
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
            <div className="eyebrow">Your travel identity. Finally.</div>
            <h1 className="mt-5 font-display font-semibold text-[40px] sm:text-5xl lg:text-[72px] leading-[1.02] tracking-tight">
              The passport that proves who you are as a traveler.
            </h1>
            <p className="mt-6 text-lg text-mute max-w-xl leading-relaxed">
              Not a booking app. A living record of every trip you've taken,
              every place you've loved, and every traveler who's going where
              you're going next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/waitlist" className="pill-cta pill-primary">
                Claim your passport
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
                Already 2,400 travelers on the waitlist
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
              Every platform forgets you the moment you close the app.
            </h2>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {[
              "Your 47 trips are scattered across emails, WhatsApp screenshots, and memories no one else can verify.",
              "You've paid 25–30% commission to platforms that don't care if your guest had a good time.",
              "You wanted a travel partner for Ladakh. You got zero tools to find one.",
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
          <div className="eyebrow">what makes us different</div>
          <h2 className="mt-4 font-display font-medium text-4xl lg:text-5xl max-w-3xl leading-tight">
            Three things no travel platform has ever built together.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<IconPassport />}
              title="Your travel identity, verified."
              body="Log every trip. Earn destination badges. Build a profile that proves your experience — not just your follower count. Your passport is yours forever, no matter what platforms come and go."
              stat="47 destinations avg. per power traveler"
            />
            <FeatureCard
              icon={<IconPeople />}
              title="Find who's going where you're going."
              body="Tell us your destination and dates. We find travelers with matching budgets, pace, and travel style — verified by their actual trip history, not a bio they wrote themselves."
              stat="3.2x cheaper when 4 travelers share"
            />
            <FeatureCard
              icon={<IconStore />}
              title="The stays and guides that don't advertise."
              body="A family homestay in Manali. A dhaba in Coorg that's been there 40 years. Local guides who actually live there. They pay a flat fee — not 30% commission — so their prices stay honest."
              stat="₹999/mo flat vs 28% OTA commission"
              ember
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — dark */}
      <section id="how" className="section-pad px-6 lg:px-10 bg-ink text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-medium text-4xl lg:text-5xl text-white max-w-3xl leading-tight">
            From zero to your first trip in 10 minutes.
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-teal/40" />
            {[
              {
                n: "01",
                t: "Create your passport",
                d: "Import trips from Gmail or log manually. Your history is verified, not self-reported.",
              },
              {
                n: "02",
                t: "Find your tribe",
                d: "Set your next destination. We surface travelers who match your vibe, budget, and pace.",
              },
              {
                n: "03",
                t: "Book local",
                d: "Browse our vendor marketplace. Flat prices. Verified reviews from real passport holders only.",
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
            Real travelers. Real homestays. Real numbers.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Quote
              q="I found 3 travel partners for Spiti Valley in under 2 days. We split costs, shared a cab, and saved ₹4,200 each."
              n="Ananya S."
              w="Mumbai"
            />
            <Quote
              q="We listed our guesthouse on Booking.com and paid ₹18,000 in commission last month. Here we pay ₹999. That's it."
              n="Ranjit D."
              w="Manali Homestay Owner"
              ember
            />
            <Quote
              q="My passport has 23 trips logged. When I meet other travelers, I just show them my profile. Instant credibility."
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
            Your next trip starts with knowing who you are as a traveler.
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder:text-white/55 focus:outline-none focus:bg-white/15 focus:border-white"
            />
            <button className="pill-cta bg-white text-teal hover:bg-canvas">
              Join the waitlist
            </button>
          </form>
          <div className="mt-4 text-sm text-white/70">
            No spam. No booking fees. Just your passport.
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
