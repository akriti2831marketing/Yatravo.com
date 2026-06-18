import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/waitlist")({
  head: () => ({
    meta: [
      { title: "Join the Waitlist — Yatravo" },
      { name: "description", content: "Be the first to carry your passport. Join 2,400+ travelers and vendors already on the list." },
      { property: "og:title", content: "Join the Waitlist — Yatravo" },
      { property: "og:description", content: "Travelers get 6 months free passport premium. Vendors get 3 months free listing." },
      { property: "og:url", content: "/waitlist" },
    ],
    links: [{ rel: "canonical", href: "/waitlist" }],
  }),
  component: WaitlistPage,
});

function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Traveler", dest: "" });

  return (
    <div className="min-h-screen bg-canvas">
      <header className="px-6 lg:px-10 py-6 border-b border-sand">
        <Link to="/" className="font-display font-semibold text-xl text-ink">
          Yatravo<span className="text-teal">.</span>
        </Link>
      </header>

      <main className="px-6 lg:px-10 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow">early access</div>
          <h1 className="mt-4 font-display font-semibold text-5xl lg:text-6xl leading-[1.05]">
            Be the first to carry your passport.
          </h1>
          <p className="mt-6 text-lg text-mute leading-relaxed">
            We're launching soon. Join 2,400+ travelers and vendors already on the list.
          </p>

          {submitted ? (
            <div className="mt-12 stamp-card p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="mt-6 font-display text-2xl">You're on the list.</div>
              <p className="mt-3 text-mute">We'll be in touch before public launch.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-12 stamp-card p-8 space-y-5"
            >
              <Field
                label="Your name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                maxLength={80}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                maxLength={255}
              />
              <div>
                <label className="block text-sm font-medium mb-2">I am a...</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-canvas border border-sand focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
                >
                  <option>Traveler</option>
                  <option>Homestay Owner</option>
                  <option>Local Guide</option>
                  <option>Adventure Operator</option>
                </select>
              </div>
              <Field
                label="Your most-visited destination"
                placeholder="e.g. Manali, Goa, Ladakh..."
                value={form.dest}
                onChange={(v) => setForm({ ...form, dest: v })}
                maxLength={120}
              />
              <button type="submit" className="pill-cta pill-primary w-full justify-center mt-4">
                Claim my spot
              </button>
            </form>
          )}

          <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
            {[
              "Early access invite before public launch",
              "Travelers get 6 months free passport premium",
              "Vendors get 3 months free listing",
            ].map((t) => (
              <div key={t} className="pl-4 border-l-2 border-teal text-mute">{t}</div>
            ))}
          </div>

          <div className="mt-10 text-center font-mono-accent text-sm text-mute">
            2,412 people already on the list
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3 rounded-md bg-canvas border border-sand focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
    </div>
  );
}
