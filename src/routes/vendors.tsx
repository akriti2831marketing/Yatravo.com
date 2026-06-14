import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-chrome";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "For Vendors — Stamped" },
      { name: "description", content: "List your homestay, guide service, or local business for ₹999/month. No commissions. Verified travelers." },
      { property: "og:title", content: "For Vendors — Stamped" },
      { property: "og:description", content: "Stop paying 28% to platforms that don't care if your guests come back. Flat ₹999/month." },
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
          <div className="eyebrow">for vendors</div>
          <h1 className="mt-5 font-display font-semibold text-4xl sm:text-5xl lg:text-[64px] leading-[1.05]">
            Stop paying 28% to platforms that don't care if your guests come back.
          </h1>
          <p className="mt-6 text-lg text-mute max-w-2xl leading-relaxed">
            List your homestay, guide service, or local business for ₹999/month. Reach verified travelers who are already planning to visit your region.
          </p>
        </div>
      </section>

      {/* The math */}
      <section className="section-pad px-6 lg:px-10 bg-ink text-white">
        <div className="max-w-5xl mx-auto">
          <div className="eyebrow text-teal">the math</div>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl text-white max-w-3xl leading-tight">
            If you earn ₹50,000/month in bookings:
          </h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {[
              { p: "Booking.com takes", v: "₹14,000", neg: true },
              { p: "MakeMyTrip takes", v: "₹12,500", neg: true },
              { p: "Stamped takes", v: "₹999", brand: true },
            ].map((r) => (
              <div key={r.p} className="flex items-baseline justify-between py-6">
                <div className="text-lg text-white/80">{r.p}</div>
                <div
                  className={`font-mono-accent text-3xl lg:text-4xl ${
                    r.brand ? "text-teal" : r.neg ? "text-white/60" : "text-white"
                  }`}
                >
                  {r.v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-8 rounded-2xl bg-teal flex items-baseline justify-between flex-wrap gap-4">
            <div className="text-xl text-white/90 font-display">You keep:</div>
            <div className="font-mono-accent text-4xl lg:text-5xl text-white">₹49,001</div>
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl max-w-2xl leading-tight">What you get.</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: "Verified traveler reviews", d: "No fake reviews — reviewer must have logged trips to qualify." },
              { t: "Tribe-matched visibility", d: "Travelers planning your region see you first." },
              { t: "Direct booking inquiry", d: "Talk to your guest directly. No middleman in the chat." },
              { t: "Dashboard & calendar", d: "Booking calendar, inquiry history, and revenue at a glance." },
              { t: "Verified Local badge", d: "Shown across the platform — earns instant trust." },
              { t: "Flat pricing forever", d: "We will never introduce commissions. Written in our terms." },
            ].map((b) => (
              <div key={b.t} className="stamp-card p-6">
                <div className="font-display text-lg">{b.t}</div>
                <div className="mt-2 text-mute text-sm leading-relaxed">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10 bg-teal-light/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-2xl lg:text-3xl font-display leading-relaxed">
            "We listed in March. By April we had 11 direct bookings. We paid ₹999. That's the whole story."
          </div>
          <div className="mt-6 font-mono-accent text-sm text-mute">Priya M. · Coorg Homestay</div>
        </div>
      </section>

      <section className="section-pad px-6 lg:px-10">
        <div className="max-w-2xl mx-auto stamp-card p-10 text-center">
          <div className="eyebrow">pricing</div>
          <div className="mt-4 font-display text-5xl">₹999<span className="text-xl text-mute">/month</span></div>
          <div className="mt-2 font-mono-accent text-sm text-mute">or ₹8,999/year — save 25%</div>
          <ul className="mt-8 space-y-3 text-left text-sm">
            {[
              "Unlimited listings & photos",
              "Verified reviews only",
              "Direct traveler inquiries",
              "Booking calendar & dashboard",
              "Verified Local badge",
              "No commission. Ever.",
            ].map((f) => (
              <li key={f} className="flex gap-3">
                <span className="text-teal">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/waitlist" className="mt-8 inline-flex pill-cta pill-primary w-full justify-center">
            List your business today
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
